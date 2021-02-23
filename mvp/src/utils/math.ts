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

export const toSignificantDecimals = (
  wad: BigNumber,
  decimals: number
): string => {
  return ethers.utils.formatEther(
    ethers.utils.parseEther(
      parseFloat(ethers.utils.formatEther(wad)).toFixed(decimals)
    )
  );
};

export const formatProfitsInUSD = (
  num: BigNumber,
  ethPrice: number
): string => {
  const pnlUSD = parseFloat(ethers.utils.formatEther(num.abs())) * ethPrice;

  return (num.isNegative() ? "-" : "") + "$" + pnlUSD.toFixed(2);
};

export const formatProfitsInETH = (num: BigNumber): string => {
  const pnlUSD = parseFloat(ethers.utils.formatEther(num.abs()));

  return (num.isNegative() ? "-" : "") + pnlUSD.toFixed(3) + " ETH";
};

export const wadToUSD = (wadVal: BigNumber) => {
  const scaleFactor = ethers.BigNumber.from(10).pow(
    ethers.BigNumber.from("16")
  );
  return wadVal.div(scaleFactor).toNumber() / 100;
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
