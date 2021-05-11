import { BigNumber, ethers } from "ethers";
import currency from "currency.js";

const { formatUnits } = ethers.utils;

export const formatSignificantDecimals = (
  num: string,
  significantDecimals: number = 6
) => parseFloat(parseFloat(num).toFixed(significantDecimals)).toString();

export const formatBigNumber = (
  num: BigNumber,
  significantDecimals: number = 6,
  decimals: number = 18
) => formatSignificantDecimals(formatUnits(num, decimals), significantDecimals);

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
): string =>
  (num instanceof BigNumber
    ? parseFloat(ethers.utils.formatUnits(num, assetDecimal)) * assetPrice
    : num * assetPrice
  ).toFixed(precision);

export const assetToUSD = (
  num: BigNumber | number,
  assetPrice: number,
  assetDecimal: number = 18,
  precision: number = 2
): string =>
  currency(assetToFiat(num, assetPrice, assetDecimal, precision)).format();

export const ethToUSD = (
  num: BigNumber | number,
  ethPrice: number,
  precision: number = 2
): string => assetToUSD(num, ethPrice, 18, precision);

export const formatOption = (bn: BigNumber): number =>
  parseFloat(ethers.utils.formatUnits(bn, 8));

export const getWAD = (decimals: number) =>
  ethers.utils.parseUnits("1", decimals);

export const wmul = (x: BigNumber, y: BigNumber, decimals: number) =>
  x
    .mul(y)
    .add(getWAD(decimals).div(ethers.BigNumber.from("2")))
    .div(getWAD(decimals));

export const formatAmount = (n: number): string => {
  if (n < 1e4) return `${currency(n, { separator: ",", symbol: "" }).format()}`;
  if (n >= 1e4 && n < 1e6) return `${parseFloat((n / 1e3).toFixed(2))}K`;
  if (n >= 1e6 && n < 1e9) return `${parseFloat((n / 1e6).toFixed(2))}M`;
  if (n >= 1e9 && n < 1e12) return `${parseFloat((n / 1e9).toFixed(2))}B`;
  if (n >= 1e12) return `${parseFloat((n / 1e12).toFixed(2))}T`;

  return "";
};

export const annualizedPerformance = (performance: number) =>
  (performance * 0.9 + 1) ** 52 - 1;
