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

export type BasicStraddle = {
  address: string;
  symbol: string;
  expiryTimestamp: number;
};

export type Straddle = BasicStraddle & {
  underlying: string;
};

export const PUT_OPTION_TYPE = 1;
export const CALL_OPTION_TYPE = 2;

export const HEGIC_VENUE = 1;
export const OPYN_VENUE = 2;

export const VENUE_MAP: Record<string, number> = {
  HEGIC: HEGIC_VENUE,
  OPYN_GAMMA: OPYN_VENUE,
};

export type StraddleTrade = {
  venues: string[];
  callVenue: string;
  putVenue: string;
  amounts: BigNumber[];
  totalPremium: BigNumber;
  callPremium: BigNumber;
  callStrikePrice: BigNumber;
  putPremium: BigNumber;
  putStrikePrice: BigNumber;
  buyData: string[];
  gasPrice: BigNumber;
  strikePrices: BigNumber[];
  optionTypes: number[];
  callIndex: number;
  putIndex: number;
};

export type Product = {
  name: string;
  emoji: string;
  instruments: Straddle[];
};

export type TradeResponse = {
  venues: string[];
  optionTypes: number[];
  amounts: string[];
  strikePrices: string[];
  buyData: string[];
  gasPrice: string;
  totalPremium: string;
  premiums: string[];
  callIndex: number;
  putIndex: number;
};

export type PositionsQuery = {
  id: string;
  instrumentAddress: string;
  cost: string;
  exercised: boolean;
  amount: string;
  optionTypes: number[];
  venues: string[];
  strikePrices: string[];
  exerciseProfit: string;
};

export type InstrumentPosition = {
  positionID: number;
  instrumentAddress: string;
  expiry: number;
  exercised: boolean;
  optionTypes: number[];
  amount: BigNumber;
  strikePrices: BigNumber[];
  venues: string[];
  pnl: BigNumber;
  canExercise: boolean;
  exerciseProfit: BigNumber;
};
