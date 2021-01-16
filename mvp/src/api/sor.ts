import { BigNumber, ethers } from "ethers";
import { TradeRequest, TradeResponse } from "./types";
import axios from "axios";
import { IAggregatedOptionsInstrumentFactory } from "../codegen/IAggregatedOptionsInstrumentFactory";
import getProvider from "./getProvider";
import externalAddresses from "../constants/externalAddresses.json";
import deployments from "../constants/deployments.json";
import instrumentAddresses from "../constants/instruments.json";
import { MulticallFactory } from "../codegen/MulticallFactory";
import { IProtocolAdapterFactory } from "../codegen/IProtocolAdapterFactory";
import { AbiCoder } from "ethers/lib/utils";

const provider = getProvider();
const abiCoder = new ethers.utils.AbiCoder();

const instrument = IAggregatedOptionsInstrumentFactory.connect(
  instrumentAddresses.mainnet[0].address,
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
  // const otokenAddress = "0x78A36417C9f3814AE1B4367D03bfF6AC6fd631FB";
  // const apiResponse = await get0xQuote(otokenAddress, BigNumber.from("100000"));

  console.log(
    await getPrices(
      ethers.utils.parseUnits("1100", "ether"),
      BigNumber.from(tradeRequest.buyAmount.toString())
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

async function getPrices(strikePrice: BigNumber, amount: BigNumber) {
  const promises = adapterAddresses.map((adapterAddress) => {
    if (adapterAddress === GAMMA_ADAPTER) {
      return;
      // return get0xQuote("", BigNumber.from("0"));
    }
    return getPriceFromContract(adapterAddress, strikePrice, amount);
  });
  return await Promise.all(promises);
}

async function getPriceFromContract(
  adapterAddress: string,
  strikePrice: BigNumber,
  amount: BigNumber
): Promise<BigNumber[]> {
  const adapter = IProtocolAdapterFactory.connect(adapterAddress, provider);
  const optionTermsFromContract = await getOptionTerms();

  const multicall = MulticallFactory.connect(
    externalAddresses.mainnet.multicall,
    provider
  );

  const optionTerms = [PUT_OPTION, CALL_OPTION].map((optionType) => ({
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

  return response.returnData.map((data) =>
    BigNumber.from(abiCoder.decode(["uint256"], data).toString())
  );
}

async function getOptionTerms() {
  const multicall = MulticallFactory.connect(
    externalAddresses.mainnet.multicall,
    provider
  );

  const types = ["address", "address", "address", "uint256"];
  const functionNames = [
    "underlying",
    "strikeAsset",
    "collateralAsset",
    "expiry",
  ];
  const data = functionNames.map((f) =>
    instrument.interface.encodeFunctionData(f)
  );
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
  const data: Record<string, string> = {
    buyToken: otokenAddress,
    sellToken: "USDC",
    buyAmount: buyAmount.toString(),
  };
  const query = new URLSearchParams(data).toString();
  const url = `${ZERO_EX_API_URI}?${query}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
}
