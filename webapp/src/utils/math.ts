import { BigNumber, ethers } from "ethers";
const { formatEther } = ethers.utils;

export const formatSignificantDecimals = (
  num: string,
  significantDecimals: number = 6
) => {
  return parseFloat(parseFloat(num).toFixed(significantDecimals)).toString();
};

export const formatBigNumber = (
  num: BigNumber,
  significantDecimals: number = 6
) => {
  return formatSignificantDecimals(formatEther(num), significantDecimals);
};

export const toFiat = (etherVal: BigNumber) => {
  const scaleFactor = ethers.BigNumber.from(10).pow("6");
  const scaled = etherVal.div(scaleFactor);
  return scaled.toNumber() / 10 ** 2;
};

export const toUSD = (bn: BigNumber) =>
  Math.floor(parseFloat(ethers.utils.formatEther(bn))).toLocaleString();

export const toETH = (bn: BigNumber, precision: number = 4) =>
  parseFloat(ethers.utils.formatEther(bn)).toFixed(precision);

export const ethToUSD = (
  num: BigNumber | number,
  ethPrice: number,
  precision: number = 2
): string => {
  const pnlUSD =
    num instanceof BigNumber
      ? parseFloat(ethers.utils.formatEther(num)) * ethPrice
      : num * ethPrice;

  return "$" + pnlUSD.toFixed(precision);
};

export const WAD = ethers.utils.parseEther("1");

export const wmul = (x: BigNumber, y: BigNumber) => {
  return x
    .mul(y)
    .add(WAD.div(ethers.BigNumber.from("2")))
    .div(WAD);
};
