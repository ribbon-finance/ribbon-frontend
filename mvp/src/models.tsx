export type Instrument = {
  apy: number;
  strike: number;
  yield: number;
  expiryTimestamp: number;
};

export type Product = {
  productTitle: string;
  targetCurrency: string;
  paymentCurrency: string;
  expiryTimestamp: number;
  instruments: Instrument[];
};
