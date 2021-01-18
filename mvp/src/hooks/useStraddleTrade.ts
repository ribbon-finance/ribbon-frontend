import { BigNumber } from "ethers";
import axios from "axios";

export const useStraddleTrade = (
  // instrumentAddress: string,
  // spotPrice: BigNumber,
  expiry: number,
  buyAmount: BigNumber
) => {
  return {
    venues: [],
    amounts: [],
    totalPremium: BigNumber.from("22636934749846005"),
    callPremium: BigNumber.from("22636934749846005"),
    callStrikePrice: BigNumber.from("500000000000000000000"),
    putPremium: BigNumber.from("22636934749846005"),
    putStrikePrice: BigNumber.from("500000000000000000000"),
    buyData: [],
    gasPrice: BigNumber.from("0"),
  };
};
