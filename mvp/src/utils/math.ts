import { BigNumber, ethers } from "ethers";

export const etherToDecimals = (etherVal: BigNumber) => {
  const scaleFactor = ethers.BigNumber.from(10).pow("16");
  const scaled = etherVal.div(scaleFactor);
  return scaled.toNumber() / 10 ** 2;
};
