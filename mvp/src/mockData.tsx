import { Product } from "./models";
import instruments from "./constants/instruments.json";

export const products: Product[] = [
  {
    name: "Twin Yield ETH-USD",
    targetCurrency: "ETH",
    paymentCurrency: "ETH",
    expiryTimestamp: instruments.kovan[0].expiry,
    instruments: [],
  },
];
