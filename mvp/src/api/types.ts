import { BigNumber } from "ethers";

export type VenueName = "HEGIC" | "OPYN_GAMMA";

export type OptionType = 1 | 2;

export type TradeRequest = {
  expiry: number;
  spotPrice: number;
  buyAmount: number;
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
