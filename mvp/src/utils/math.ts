import { BigNumber, ethers } from "ethers";

export const etherToDecimals = (etherVal: BigNumber) => {
  const scaleFactor = ethers.BigNumber.from(10).pow("16");
  const scaled = etherVal.div(scaleFactor);
  return scaled.toNumber() / 10 ** 2;
};

export const toFiat = (etherVal: BigNumber) => {
  const scaleFactor = ethers.BigNumber.from(10).pow("6");
  const scaled = etherVal.div(scaleFactor);
  return scaled.toNumber() / 10 ** 2;
};

export const WAD = ethers.utils.parseEther("1");

export const wmul = (x: BigNumber, y: BigNumber) => {
  return x
    .mul(y)
    .add(WAD.div(ethers.BigNumber.from("2")))
    .div(WAD);
};

export const wdiv = (x: BigNumber, y: BigNumber) => {
  return x
    .mul(WAD)
    .add(y.div(ethers.BigNumber.from("2")))
    .div(y);
};
