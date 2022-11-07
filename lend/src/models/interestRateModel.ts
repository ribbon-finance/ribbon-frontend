import { BigNumber } from "ethers";

export type InterestData = {
  kink: BigNumber;
  kinkRate: BigNumber;
  zeroRate: BigNumber;
  fullRate: BigNumber;
};

export const defaultInterestData: InterestData = {
  kink: BigNumber.from("0"),
  kinkRate: BigNumber.from("0"),
  zeroRate: BigNumber.from("0"),
  fullRate: BigNumber.from("0"),
};
