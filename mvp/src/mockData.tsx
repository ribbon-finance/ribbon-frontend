import { Product } from "./models";

export const products: Product[] = [
  {
    name: "Twin Yield ETH-USDC",
    targetCurrency: "ETH",
    paymentCurrency: "USDC",
    expiryTimestamp: 1604361600,
    instruments: [
      {
        symbol: "TY-ETHUSDC-390-03112020",
        apy: 15.29,
        strike: 390,
        yield: 0.04,
        expiryTimestamp: 1604361600
      },
      {
        symbol: "TY-ETHUSDC-400-03112020",
        apy: 55.74,
        strike: 400,
        yield: 0.15,
        expiryTimestamp: 1604361600
      }
    ]
  }
];
