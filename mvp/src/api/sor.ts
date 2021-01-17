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

async function getPrices(strikePrice: BigNumber, amount: BigNumber) {
  const optionTerms = await getOptionTerms();

  const promises = adapterAddresses.map((adapterAddress) => {
    if (adapterAddress === GAMMA_ADAPTER) {
      return;
      // return get0xQuote("", BigNumber.from("0"));
    }
    return getPriceFromContract(
      adapterAddress,
      optionTerms,
      strikePrice,
      amount
    );
  });
  return await Promise.all(promises);
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

async function get0xPrices(
  adapterAddress: string,
  optionTerms: ContractOptionTerms,
  strikePrice: BigNumber
) {
  const adapter = IProtocolAdapterFactory.connect(adapterAddress, provider);

  const calls = [PUT_OPTION, CALL_OPTION].map((optionType) => {
    const terms = { ...optionTerms, strikePrice, optionType };
    return {
      target: adapterAddress,
      callData: adapter.interface.encodeFunctionData("getOptionsAddress", [
        terms,
      ]),
    };
  });

  const response = await multicall.aggregate(calls);
  response;
}

async function get0xQuote(otokenAddress: string, buyAmount: BigNumber) {
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
  const decimals = 6; //just scale for USDC amounts for now

  const scaledSellAmount = parseInt(apiResponse.sellAmount) / decimals;
  const totalETH =
    scaledSellAmount / parseFloat(apiResponse.sellTokenToEthRate);

  return ethers.utils
    .parseUnits(totalETH.toPrecision(6), "ether")
    .add(BigNumber.from(apiResponse.value));
}
