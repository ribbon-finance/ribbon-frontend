import { BigNumber } from "@ethersproject/bignumber";
import { ethers } from "ethers";
import { secondsPerYear } from "../constants/constants";

const { formatUnits } = ethers.utils;

const bigNumber = (bigNumber: BigNumber) => {
  return parseFloat(formatUnits(bigNumber, 18));
};

export const borrowRate = (
  utilRate: number,
  kink: BigNumber,
  kinkRate: BigNumber,
  fullRate: BigNumber,
  zeroRate: BigNumber
) => {
  const k = bigNumber(kink);
  const theta = utilRate <= k ? 0 : 1;
  const n = -(1 / Math.log2(k));
  const cosX = utilRate <= 0 ? 1 : Math.cos(2 * Math.PI * utilRate ** n);
  const kRate = bigNumber(kinkRate);
  const fRate = bigNumber(fullRate);
  const zRate = bigNumber(zeroRate);
  return (
    ((zRate * (1 + cosX) * (1 - theta) +
      fRate * (1 + cosX) * theta +
      kRate * (1 - cosX)) /
      2) *
    secondsPerYear
  );
};

export const lendingRate = (
  utilRate: number,
  borrowRate: number,
  reserveFactor: BigNumber
) => {
  return (
    (utilRate *
      (borrowRate / secondsPerYear) *
      (1 - bigNumber(reserveFactor)) *
      secondsPerYear) /
    100
  );
};
