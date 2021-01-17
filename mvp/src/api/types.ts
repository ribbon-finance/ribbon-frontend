import { BigNumber } from "ethers";

export type VenueName = "HEGIC" | "OPYN_GAMMA";

export type OptionType = 1 | 2;

export type TradeRequest = {
  spotPrice: string;
  buyAmount: string;
};

export type TradeResponse = {
  venues: VenueName[];
  optionTypes: OptionType[];
  amounts: string[];
  strikePrices: string[];
  buyData: string[];
  gasPrice: string[];
  value: string;
};

export type ZeroExApiResponse = {
  to: string;
  value: string;
  data: string;
  gasPrice: string;
  sellTokenAddress: string;
  buyTokenAddress: string;
  buyAmount: string;
  sellAmount: string;
  sellTokenToEthRate: string;
};
