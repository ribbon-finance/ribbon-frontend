import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";

export const isVaultFull = (deposits: BigNumber, cap: BigNumber) => {
  const margin = parseEther("1");
  return !cap.isZero() && deposits.gte(cap.sub(margin));
};
