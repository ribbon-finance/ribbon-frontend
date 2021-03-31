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

export const toETH = (bn: BigNumber) =>
  parseFloat(ethers.utils.formatEther(bn)).toFixed(4);

export const ethToUSD = (num: BigNumber, ethPrice: number): string => {
  const pnlUSD = parseFloat(ethers.utils.formatEther(num)) * ethPrice;

  return "$" + pnlUSD.toFixed(2);
};
