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
  currency: string;
  expiryTimestamp: number;
  callPremium: number;
  callStrikePrice: number;
  callVenue: string;
  callPositionID: string | null;
  putPremium: number;
  putStrikePrice: number;
  putVenue: string;
  putPositionID: string | null;
};

export type Product = {
  name: string;
  productType: string;
  instruments: Straddle[];
};
