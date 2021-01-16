import { BigNumber } from "ethers";

export type VenueName = "HEGIC" | "OPYN_GAMMA";

export type OptionType = 1 | 2;

export type TradeRequest = {
  spotPrice: number;
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
