import { BigNumber, ethers } from "ethers";
import currency from "currency.js";

const { formatUnits } = ethers.utils;

export const formatSignificantDecimals = (
  num: string,
  significantDecimals: number = 6
) => {
  return parseFloat(parseFloat(num).toFixed(significantDecimals)).toString();
};

export const formatBigNumber = (
  num: BigNumber,
  significantDecimals: number = 6,
  decimals: number = 18
) => {
  return formatSignificantDecimals(
    formatUnits(num, decimals),
    significantDecimals
  );
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

export const assetToFiat = (
  num: BigNumber | number,
  assetPrice: number,
  assetDecimal: number = 18,
  precision: number = 2
): string => {
  return (num instanceof BigNumber
    ? parseFloat(ethers.utils.formatUnits(num, assetDecimal)) * assetPrice
    : num * assetPrice
  ).toFixed(precision);
};

export const assetToUSD = (
  num: BigNumber | number,
  assetPrice: number,
  assetDecimal: number = 18,
  precision: number = 2
): string => {
  return currency(
    assetToFiat(num, assetPrice, assetDecimal, precision)
  ).format();
};

export const ethToUSD = (
  num: BigNumber | number,
  ethPrice: number,
  precision: number = 2
): string => {
  return assetToUSD(num, ethPrice, 18, precision);
};

export const formatOption = (bn: BigNumber): number =>
  parseFloat(ethers.utils.formatUnits(bn, 8));

export const getWAD = (decimals: number) =>
  ethers.utils.parseUnits("1", decimals);

export const wmul = (x: BigNumber, y: BigNumber, decimals: number) => {
  return x
    .mul(y)
    .add(getWAD(decimals).div(ethers.BigNumber.from("2")))
    .div(getWAD(decimals));
};
