import { BigNumber } from "ethers";

export type Instrument = {
  symbol: string;
  instrumentAddress: string;
  strikePrice: number;
  balancerPool: string;
  instrumentSpotPrice: BigNumber;
  swapFee: BigNumber;
  targetSpotPrice: number;
  expiryTimestamp: number;
  dTokenAddress: string;
  paymentCurrencyAddress: string;
};

export type OldProduct = {
  name: string;
  targetCurrency: string;
  paymentCurrency: string;
  expiryTimestamp: number;
  instruments: Instrument[];
};

export type Straddle = {
  address: string;
  symbol: string;
  underlying: string;
  expiryTimestamp: number;
};

export type StraddleTrade = {
  venues: string[];
  amounts: BigNumber[];
  totalPremium: BigNumber;
  callPremium: BigNumber;
  callStrikePrice: BigNumber;
  putPremium: BigNumber;
  putStrikePrice: BigNumber;
  buyData: string[];
  gasPrice: BigNumber;
};

export type Product = {
  name: string;
  emoji: string;
  instruments: Straddle[];
};
