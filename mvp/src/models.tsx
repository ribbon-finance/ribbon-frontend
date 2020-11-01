export type Instrument = {
  symbol: string;
  apy: number;
  strike: number;
  yield: number;
  expiryTimestamp: number;
};

export type Product = {
  name: string;
  targetCurrency: string;
  paymentCurrency: string;
  expiryTimestamp: number;
  instruments: Instrument[];
};
