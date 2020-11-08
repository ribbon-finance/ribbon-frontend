export type Instrument = {
  symbol: string;
  strikePrice: number;
  balancerPool: string;
  instrumentSpotPrice: number;
  targetSpotPrice: number;
  expiryTimestamp: number;
  dTokenAddress: string;
  paymentCurrencyAddress: string;
};

export type Product = {
  name: string;
  targetCurrency: string;
  paymentCurrency: string;
  expiryTimestamp: number;
  instruments: Instrument[];
};
