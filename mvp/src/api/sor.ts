import { BigNumber, ethers } from "ethers";
import { ZeroExApiResponse, TradeRequest, TradeResponse } from "./types";
import axios from "axios";
import getProvider from "./getProvider";
import { wmul } from "../utils/math";
import externalAddresses from "../constants/externalAddresses.json";
import deployments from "../constants/deployments.json";
import instrumentAddresses from "../constants/instruments.json";
import { MulticallFactory } from "../codegen/MulticallFactory";
import { IProtocolAdapterFactory } from "../codegen/IProtocolAdapterFactory";

const provider = getProvider();
const abiCoder = new ethers.utils.AbiCoder();

const multicall = MulticallFactory.connect(
  externalAddresses.mainnet.multicall,
  provider
);

const PUT_OPTION = 1;
const CALL_OPTION = 2;
const HEGIC_PROTOCOL = "HEGIC";
const HEGIC_ADAPTER = deployments.mainnet.HegicAdapterLogic;
const GAMMA_ADAPTER = deployments.mainnet.GammaAdapterLogic;
const adapterAddresses = [HEGIC_ADAPTER, GAMMA_ADAPTER];
const ETH_ADDRESS = "0x0000000000000000000000000000000000000000";
const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

export async function getBestTrade(
  tradeRequest: TradeRequest
): Promise<TradeResponse> {
  const { spotPrice, buyAmount, instrument: instrumentAddress } = tradeRequest;

  const instrumentDetails = instrumentAddresses.mainnet.find(
    (i) => i.address === instrumentAddress
  );
  if (!instrumentDetails) {
    throw new Error("Instrument not found");
  }

  const prices = await getPrices(
    instrumentAddress,
    BigNumber.from(spotPrice.toString()),
    BigNumber.from(buyAmount.toString())
  );
  console.log(prices);

  return {
    venues: [],
    optionTypes: [],
    amounts: [],
    strikePrices: [],
    buyData: [],
    gasPrice: [],
    value: BigNumber.from("0").toString(),
  };
}

const ZERO_EX_API_URI = "https://api.0x.org/swap/v1/quote";

type ContractOptionTerms = {
  underlying: string;
  strikeAsset: string;
  collateralAsset: string;
  expiry: BigNumber;
};

type PriceQuote = {
  premium: BigNumber;
  strikePrice: BigNumber;
  exists: boolean;
};

type CallPutPriceQuotes = {
  call: PriceQuote;
  put: PriceQuote;
};

async function getPrices(
  instrument: string,
  spotPrice: BigNumber,
  buyAmount: BigNumber
): Promise<CallPutPriceQuotes[]> {
  const promises = adapterAddresses.map(async (adapterAddress) => {
    if (adapterAddress === GAMMA_ADAPTER) {
      return await get0xPrices(spotPrice, buyAmount);
    }

    return await getPriceFromContract(
      instrument,
      adapterAddress,
      spotPrice,
      buyAmount
    );
  });
  const res = await Promise.all(promises);
  return res;
}

async function getPriceFromContract(
  instrument: string,
  adapterAddress: string,
  spotPrice: BigNumber,
  amount: BigNumber
): Promise<CallPutPriceQuotes> {
  const optionTermsFromContract = getOptionTerms(instrument);
  const optionTypes = [PUT_OPTION, CALL_OPTION];
  const adapter = IProtocolAdapterFactory.connect(adapterAddress, provider);

  // just hardcode the bounds to be +-5%
  const callStrikePrice = wmul(spotPrice, ethers.utils.parseEther("1.05"));
  const putStrikePrice = wmul(spotPrice, ethers.utils.parseEther("0.95"));

  const optionTerms = optionTypes.map((optionType) => ({
    ...optionTermsFromContract,
    strikePrice: optionType === CALL_OPTION ? callStrikePrice : putStrikePrice,
    optionType,
  }));

  const calls = optionTerms.map((optionTerm) => ({
    target: adapterAddress,
    callData: adapter.interface.encodeFunctionData("premium", [
      optionTerm,
      amount,
    ]),
  }));
  const { returnData } = await multicall.aggregate(calls);

  const callPremium = BigNumber.from(
    abiCoder.decode(["uint256"], returnData[0]).toString()
  );
  const putPremium = BigNumber.from(
    abiCoder.decode(["uint256"], returnData[1]).toString()
  );

  return {
    call: {
      strikePrice: callStrikePrice,
      premium: callPremium,
      exists: !callPremium.isZero(),
    },
    put: {
      strikePrice: putStrikePrice,
      premium: putPremium,
      exists: !putPremium.isZero(),
    },
  };
}

type OtokenMatch = { address: string; strikePrice: BigNumber };
type OtokenMatches = { call: OtokenMatch | null; put: OtokenMatch | null };

async function get0xPrices(spotPrice: BigNumber, buyAmount: BigNumber) {
  const otokenMatches = getNearestOtoken(spotPrice);
  const zero = BigNumber.from("0");

  return {
    call: {
      strikePrice: otokenMatches.call ? otokenMatches.call.strikePrice : zero,
      premium: otokenMatches.call
        ? await get0xQuote(otokenMatches.call.address, buyAmount)
        : zero,
      exists: Boolean(otokenMatches.call),
    },
    put: {
      strikePrice: otokenMatches.put ? otokenMatches.put.strikePrice : zero,
      premium: otokenMatches.put
        ? await get0xQuote(otokenMatches.put.address, buyAmount)
        : zero,
      exists: Boolean(otokenMatches.put),
    },
  };
}

function getNearestOtoken(spotPrice: BigNumber): OtokenMatches {
  const scalingFactor = BigNumber.from("10").pow(BigNumber.from("10"));
  const otokens = externalAddresses.mainnet.otokens.map((otoken) => ({
    ...otoken,
    strikePrice: BigNumber.from(otoken.strikePrice).mul(scalingFactor),
  }));

  // min-max bounds are 10% from the spot price
  const minStrikePrice = wmul(spotPrice, ethers.utils.parseEther("0.9"));
  const maxStrikePrice = wmul(spotPrice, ethers.utils.parseEther("1.3"));

  const callOtokens = otokens.filter(
    (otoken) =>
      !otoken.isPut &&
      otoken.strikePrice.gt(spotPrice) &&
      otoken.strikePrice.lt(maxStrikePrice)
  );
  const putOtokens = otokens.filter(
    (otoken) =>
      otoken.isPut &&
      otoken.strikePrice.lt(spotPrice) &&
      otoken.strikePrice.gt(minStrikePrice)
  );

  let addresses: OtokenMatches = {
    call: null,
    put: null,
  };

  const minDiffOtoken = (otokens) => {
    const strikePrices = otokens.map((otoken) => otoken.strikePrice);
    const priceDiff = strikePrices.map((p) => spotPrice.sub(p).abs());
    // 2^256-1
    let minPrice = BigNumber.from("2")
      .pow(BigNumber.from("256"))
      .sub(BigNumber.from("1"));
    let minIndex = 0;

    priceDiff.forEach((diff: BigNumber, index: number) => {
      if (diff.lt(minPrice)) {
        minPrice = diff;
        minIndex = index;
      }
    });
    return {
      address: ethers.utils.getAddress(otokens[minIndex].address),
      strikePrice: otokens[minIndex].strikePrice,
    };
  };

  if (callOtokens.length) {
    addresses.call = minDiffOtoken(callOtokens);
  }
  if (putOtokens.length) {
    addresses.put = minDiffOtoken(putOtokens);
  }

  return addresses;
}

function getOptionTerms(instrumentAddress: string): ContractOptionTerms {
  const instrumentDetails = instrumentAddresses.mainnet.find(
    (i) => i.address === instrumentAddress
  );
  if (!instrumentDetails) {
    throw new Error(`Instrument with address ${instrumentAddress} not found`);
  }
  return {
    underlying: ETH_ADDRESS,
    collateralAsset: ETH_ADDRESS,
    strikeAsset: USDC_ADDRESS,
    expiry: BigNumber.from(instrumentDetails.expiry),
  };
}

async function get0xQuote(otokenAddress: string, buyAmount: BigNumber) {
  const scalingFactor = BigNumber.from("10").pow(BigNumber.from("10"));
  buyAmount = buyAmount.div(scalingFactor);

  const data: Record<string, string> = {
    buyToken: otokenAddress,
    sellToken: "USDC",
    buyAmount: buyAmount.toString(),
  };
  const query = new URLSearchParams(data).toString();
  const url = `${ZERO_EX_API_URI}?${query}`;

  try {
    const response = await axios.get(url);
    return calculateZeroExOrderCost(response.data);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

function calculateZeroExOrderCost(apiResponse: ZeroExApiResponse) {
  const decimals = 6; // just scale decimals for USDC amounts for now, because USDC is the purchase token

  const scaledSellAmount = parseInt(apiResponse.sellAmount) / 10 ** decimals;
  const totalETH =
    scaledSellAmount / parseFloat(apiResponse.sellTokenToEthRate);

  return ethers.utils
    .parseUnits(totalETH.toPrecision(6), "ether")
    .add(BigNumber.from(apiResponse.value));
}
