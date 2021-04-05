import { BigNumber } from "ethers";

export const isVaultFull = (deposits: BigNumber, cap: BigNumber) => {
  return !cap.isZero() && deposits.gte(cap);
};
