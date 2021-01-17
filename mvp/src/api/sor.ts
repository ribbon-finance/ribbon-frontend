import { BigNumber, ethers } from "ethers";
import {
  ZeroExApiResponse,
  TradeRequest,
  TradeResponse,
  OptionType,
} from "./types";
import axios from "axios";
import { IAggregatedOptionsInstrumentFactory } from "../codegen/IAggregatedOptionsInstrumentFactory";
import getProvider from "./getProvider";
import { wmul } from "../utils/math";
import externalAddresses from "../constants/externalAddresses.json";
import deployments from "../constants/deployments.json";
import instrumentAddresses from "../constants/instruments.json";
import { MulticallFactory } from "../codegen/MulticallFactory";
import { IProtocolAdapterFactory } from "../codegen/IProtocolAdapterFactory";

const provider = getProvider();
const abiCoder = new ethers.utils.AbiCoder();

const instrument = IAggregatedOptionsInstrumentFactory.connect(
  instrumentAddresses.mainnet[0].address,
  provider
);
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

export async function getBestTrade(
  tradeRequest: TradeRequest
): Promise<TradeResponse> {
  const { spotPrice, buyAmount } = tradeRequest;

  console.log(
    await getPrices(
      BigNumber.from(spotPrice.toString()),
      BigNumber.from(buyAmount.toString())
    )
  );

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
  optionType: number;
  cost: BigNumber;
  exists: boolean;
};

async function getPrices(spotPrice: BigNumber, buyAmount: BigNumber) {
  const promises = adapterAddresses.map(async (adapterAddress) => {
    if (adapterAddress === GAMMA_ADAPTER) {
      const otokenMatches = getNearestOtoken(spotPrice);

      return {
        call:
          otokenMatches.call &&
          (await get0xQuote(otokenMatches.call.address, buyAmount)),
        put:
          otokenMatches.put &&
          (await get0xQuote(otokenMatches.put.address, buyAmount)),
      };
    }
  });
  const res = await Promise.all(promises);
  return res;
}

async function getPriceFromContract(
  adapterAddress: string,
  optionTermsFromContract: ContractOptionTerms,
  strikePrice: BigNumber,
  amount: BigNumber
): Promise<PriceQuote[]> {
  const adapter = IProtocolAdapterFactory.connect(adapterAddress, provider);

  const optionTypes = [PUT_OPTION, CALL_OPTION];

  const optionTerms = optionTypes.map((optionType) => ({
    ...optionTermsFromContract,
    strikePrice,
    optionType,
  }));

  const calls = optionTerms.map((optionTerm) => ({
    target: adapterAddress,
    callData: adapter.interface.encodeFunctionData("premium", [
      optionTerm,
      amount,
    ]),
  }));
  const response = await multicall.aggregate(calls);

  return response.returnData.map((data, i) => ({
    optionType: optionTypes[i],
    cost: BigNumber.from(abiCoder.decode(["uint256"], data).toString()),
    exists: true,
  }));
}

type OtokenMatch = { address: string; strikePrice: BigNumber };
type OtokenMatches = { call: OtokenMatch | null; put: OtokenMatch | null };

function getNearestOtoken(spotPrice: BigNumber): OtokenMatches {
  const scalingFactor = BigNumber.from("10").pow(BigNumber.from("10"));
  const otokens = externalAddresses.mainnet.otokens.map((otoken) => ({
    ...otoken,
    strikePrice: BigNumber.from(otoken.strikePrice).mul(scalingFactor),
  }));

  // min-max bounds are 10% from the spot price
  const minStrikePrice = wmul(spotPrice, ethers.utils.parseEther("0.7"));
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

async function getOptionTerms(): Promise<ContractOptionTerms> {
  const types = ["address", "address", "address", "uint256"];

  const data = [
    instrument.interface.encodeFunctionData("underlying"),
    instrument.interface.encodeFunctionData("strikeAsset"),
    instrument.interface.encodeFunctionData("collateralAsset"),
    instrument.interface.encodeFunctionData("expiry"),
  ];

  const calls = data.map((d) => ({ target: instrument.address, callData: d }));
  const returnData = await multicall.aggregate(calls);

  const args = returnData.returnData.map((r, i) =>
    abiCoder.decode([types[i]], r)
  );

  return {
    underlying: args[0].toString(),
    strikeAsset: args[1].toString(),
    collateralAsset: args[2].toString(),
    expiry: BigNumber.from(args[3].toString()),
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
