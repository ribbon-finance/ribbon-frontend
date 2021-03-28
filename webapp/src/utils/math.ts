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
