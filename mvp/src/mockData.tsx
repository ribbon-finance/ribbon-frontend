import { Product, Straddle } from "./models";

const straddle1: Straddle = {
  currency: "0x0000000000000000000000000000000000000000",
  expiryTimestamp: 1608883200,
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
    productType: "Straddle",
    instruments: [straddle1],
  },
];
