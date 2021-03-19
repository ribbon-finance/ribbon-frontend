import { BigNumber, ethers } from "ethers";
import {
  TradeRequest,
  TradeResponse,
  CallPutPriceQuotes,
  PriceQuote,
} from "./types";
import getProvider from "./getProvider";
import { wmul } from "../utils/math";
import externalAddresses from "../constants/externalAddresses.json";
import deployments from "../constants/deployments.json";
import instrumentAddresses from "../constants/instruments.json";
import { MulticallFactory } from "../codegen/MulticallFactory";
import { IProtocolAdapterFactory } from "../codegen/IProtocolAdapterFactory";
import {
  CALL_OPTION,
  GAMMA_PROTOCOL,
  getOptionTerms,
  HEGIC_PROTOCOL,
  MAX_UINT256,
  PUT_OPTION,
} from "./utils";
import { get0xPrices } from "./opyn";

const { constants } = ethers;
const provider = getProvider();
const abiCoder = new ethers.utils.AbiCoder();

const multicall = MulticallFactory.connect(
  externalAddresses.mainnet.multicall,
  provider
);

// this is used to initiate the provider connection so we have faster speeds for subsequent calls
multicall.aggregate([]);

const HEGIC_MIN_STRIKE = ethers.utils.parseEther("0.95");
const HEGIC_MAX_STRIKE = ethers.utils.parseEther("1.05");

const HEGIC_ADAPTER = deployments.mainnet.HegicAdapterLogic;
const GAMMA_ADAPTER = deployments.mainnet.GammaAdapterLogic;
const ADAPTER_ADDRESSES = [GAMMA_ADAPTER, HEGIC_ADAPTER];
const VENUE_NAMES = [GAMMA_PROTOCOL, HEGIC_PROTOCOL];
// const ADAPTER_ADDRESSES = [GAMMA_ADAPTER];
// const VENUE_NAMES = [GAMMA_PROTOCOL];

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
  console.time("getPrices");

  const prices = await getPrices(
    instrumentAddress,
    BigNumber.from(spotPrice.toString()),
    BigNumber.from(buyAmount.toString())
  );
  const bestPriceQuote = getBestPrice(prices);
  console.timeEnd("getPrices");

  // now we have to transpose the PriceQuote object into arrays
  const venues = [bestPriceQuote.put.venueName, bestPriceQuote.call.venueName];
  const amounts = [buyAmount, buyAmount];
  const strikePrices = [
    bestPriceQuote.put.strikePrice.toString(),
    bestPriceQuote.call.strikePrice.toString(),
  ];
  const buyData = [bestPriceQuote.put.data, bestPriceQuote.call.data];

  const gasPrice = Math.max(
    bestPriceQuote.put.gasPrice.toNumber(),
    bestPriceQuote.call.gasPrice.toNumber()
  ).toString();

  const premiums = [
    bestPriceQuote.put.premium.toString(),
    bestPriceQuote.call.premium.toString(),
  ];
  const totalCost = bestPriceQuote.put.premium.add(bestPriceQuote.call.premium);

  // for the value we need to add a 2% margin just in case
  const totalPremium = wmul(
    totalCost,
    ethers.utils.parseEther("1.02")
  ).toString();

  return {
    venues,
    optionTypes: [PUT_OPTION, CALL_OPTION],
    amounts,
    strikePrices,
    buyData,
    gasPrice,
    totalPremium,
    premiums,
    putIndex: 0,
    callIndex: 1,
  };
}

async function getPrices(
  instrument: string,
  spotPrice: BigNumber,
  buyAmount: BigNumber
): Promise<CallPutPriceQuotes[]> {
  const promises = ADAPTER_ADDRESSES.map(
    async (adapterAddress, adapterIndex) => {
      let priceQuotes;

      if (adapterAddress === GAMMA_ADAPTER) {
        priceQuotes = await get0xPrices(instrument, spotPrice, buyAmount);
      } else {
        priceQuotes = await getPriceFromContract(
          instrument,
          adapterAddress,
          VENUE_NAMES[adapterIndex],
          spotPrice,
          buyAmount
        );
      }
      return { ...priceQuotes };
    }
  );
  const res = await Promise.all(promises);
  return res;
}

function getBestPrice(
  callPutPriceQuotes: CallPutPriceQuotes[]
): CallPutPriceQuotes {
  const callPriceQuotes = callPutPriceQuotes.map((q) => q.call);
  const putPriceQuotes = callPutPriceQuotes.map((q) => q.put);

  const getBestPriceQuote = (priceQuotes: PriceQuote[]) => {
    priceQuotes = priceQuotes.filter((q) => q.exists);
    if (!priceQuotes.length) {
      throw new Error("No found price quotes");
    }

    let minIndex = 0;

    if (priceQuotes.length > 1) {
      const premiums = priceQuotes.map((q) => q.premium);
      let minPremium = MAX_UINT256;

      premiums.forEach((premium, index) => {
        if (premium.lt(minPremium)) {
          minPremium = premium;
          minIndex = index;
        }
      });
    }

    return priceQuotes[minIndex];
  };

  return {
    call: getBestPriceQuote(callPriceQuotes),
    put: getBestPriceQuote(putPriceQuotes),
  };
}

async function getPriceFromContract(
  instrument: string,
  adapterAddress: string,
  venueName: string,
  spotPrice: BigNumber,
  amount: BigNumber
): Promise<CallPutPriceQuotes> {
  const optionTermsFromContract = getOptionTerms(instrument);
  const optionTypes = [PUT_OPTION, CALL_OPTION];
  const adapter = IProtocolAdapterFactory.connect(adapterAddress, provider);

  // just hardcode the bounds to be +-5%
  const putStrikePrice = wmul(spotPrice, HEGIC_MIN_STRIKE);
  const callStrikePrice = wmul(spotPrice, HEGIC_MAX_STRIKE);

  const optionTerms = optionTypes.map((optionType) => ({
    ...optionTermsFromContract,
    strikePrice: optionType === CALL_OPTION ? callStrikePrice : putStrikePrice,
    optionType,
    paymentToken: constants.AddressZero,
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
      data: "0x",
      gasPrice: BigNumber.from("0"),
      exists: !callPremium.isZero(),
      venueName,
    },
    put: {
      strikePrice: putStrikePrice,
      premium: putPremium,
      data: "0x",
      gasPrice: BigNumber.from("0"),
      exists: !putPremium.isZero(),
      venueName,
    },
  };
}
