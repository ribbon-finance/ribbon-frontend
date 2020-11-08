import { Product } from "./models";

export const products: Product[] = [
  {
    name: "Twin Yield ETH-USD",
    targetCurrency: "ETH",
    paymentCurrency: "USDC",
    expiryTimestamp: 1604361600,
    instruments: [
      {
        symbol: "TY-ETHUSDC-390-03112020",
        instrumentSpotPrice: 380,
        targetSpotPrice: 399.2,
        strikePrice: 390,
        expiryTimestamp: 1604361600,
        balancerPool: "0x75286e183D923a5F52F52be205e358c5C9101b09",
      },
      {
        symbol: "TY-ETHUSDC-400-03112020",
        instrumentSpotPrice: 390,
        targetSpotPrice: 399.2,
        strikePrice: 400,
        expiryTimestamp: 1604361600,
        balancerPool: "0x75286e183D923a5F52F52be205e358c5C9101b09",
      },
    ],
  },
];
