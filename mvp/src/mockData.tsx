import { Product, Straddle } from "./models";

const straddle1: Straddle = {
  symbol: "ETH-VOL-251220",
  currency: "0x0000000000000000000000000000000000000000",
  expiryTimestamp: 1612051200,
  callPremium: "22636934749846005",
  callStrikePrice: "500000000000000000000",
  callVenue: "OPYN_V1",
  callPositionID: null,
  putPremium: "22636934749846005",
  putStrikePrice: "500000000000000000000",
  putVenue: "HEGIC",
  putPositionID: "0",
};

export const products: Product[] = [
  {
    name: "ETH Straddle",
    emoji: "📉📈",
    instruments: [straddle1],
  },
];
