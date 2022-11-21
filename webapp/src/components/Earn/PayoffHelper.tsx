import { VaultOptions } from "shared/lib/constants/constants";

export const isPerformanceBelowBarriers = (
  performance: number,
  lowerBarrierPercentage: number
) => {
  return performance < lowerBarrierPercentage;
};

export const isPerformanceAboveBarriers = (
  performance: number,
  upperBarrierPercentage: number
) => {
  return performance > upperBarrierPercentage;
};

export const isPerformanceOutsideBarriers = (
  performance: number,
  lowerBarrierPercentage: number,
  upperBarrierPercentage: number
) => {
  return (
    performance < lowerBarrierPercentage || performance > upperBarrierPercentage
  );
};

export const getOptionMoneyness = (
  hoverPercentage: number | undefined,
  lowerBarrierPercentage: number,
  upperBarrierPercentage: number,
  performance: number
) => {
  return hoverPercentage
    ? isPerformanceOutsideBarriers(
        hoverPercentage / 100,
        lowerBarrierPercentage,
        upperBarrierPercentage
      )
      ? 0
      : hoverPercentage / 100
    : isPerformanceOutsideBarriers(
        performance,
        lowerBarrierPercentage,
        upperBarrierPercentage
      )
    ? 0
    : performance;
};

const getLeftBaseYieldPoints = (vaultOption: VaultOptions) => {
  switch (vaultOption) {
    case "rEARN-USDC":
      return 2000;
    case "rEARN-STETH":
      return 3000;
    default:
      return 0;
  }
};

const getRightBaseYieldPoints = (vaultOption: VaultOptions) => {
  switch (vaultOption) {
    case "rEARN-USDC":
      return 2000;
    case "rEARN-STETH":
      return 2000;
    default:
      return 0;
  }
};

export const getOptionMoneynessRange = (
  vaultOption: VaultOptions,
  lowerBarrierPercentage: number,
  upperBarrierPercentage: number
) => {
  let leftArray = [];
  let array = [];
  let rightArray = [];
  const leftBaseYieldPoints = getLeftBaseYieldPoints(vaultOption);
  const rightBaseYieldPoints = getRightBaseYieldPoints(vaultOption);
  switch (vaultOption) {
    case "rEARN-USDC":
      for (let i = 0; i < leftBaseYieldPoints; i += 1) {
        leftArray.push(
          Math.round(lowerBarrierPercentage * 100) - (leftBaseYieldPoints - i)
        );
      }

      for (
        let i = Math.round(lowerBarrierPercentage * 100) * 100;
        i <= Math.round(upperBarrierPercentage * 100) * 100;
        i += 1
      ) {
        array.push(i / 100);
      }

      for (let i = 0; i < rightBaseYieldPoints; i += 1) {
        rightArray.push(Math.round(upperBarrierPercentage * 100) + i + 1);
      }

      return [
        ...leftArray,
        lowerBarrierPercentage * 100 - 0.01,
        ...array,
        upperBarrierPercentage * 100 + 0.01,
        ...rightArray,
      ];
    case "rEARN-STETH":
      for (let i = 0; i < leftBaseYieldPoints; i += 1) {
        leftArray.push(
          Math.round(lowerBarrierPercentage * 100) - (leftBaseYieldPoints - i)
        );
      }

      for (
        let i = Math.round(lowerBarrierPercentage * 100) * 100;
        i <= Math.round(upperBarrierPercentage * 100) * 100;
        i += 1
      ) {
        array.push(i / 100);
      }

      for (let i = 0; i < rightBaseYieldPoints; i += 1) {
        rightArray.push(Math.round(upperBarrierPercentage * 100) + i + 1);
      }

      return [
        ...leftArray,
        lowerBarrierPercentage * 100 - 0.01,
        ...array,
        upperBarrierPercentage * 100 + 0.01,
        ...rightArray,
      ];
    default:
      return [];
  }
};

export const getYieldRange = (
  vaultOption: VaultOptions,
  lowerBarrierPercentage: number,
  upperBarrierPercentage: number,
  maxYield: number,
  baseYield: number,
  participationRate: number
) => {
  let leftArray = [];
  let array = [];
  let rightArray = [];
  const leftBaseYieldPoints = getLeftBaseYieldPoints(vaultOption);
  const rightBaseYieldPoints = getRightBaseYieldPoints(vaultOption);
  const baseYieldPercentage = baseYield * 100;
  switch (vaultOption) {
    case "rEARN-USDC":
      for (let i = 0; i < leftBaseYieldPoints; i += 1) {
        leftArray.push(baseYieldPercentage);
      }

      for (
        let i = Math.round(lowerBarrierPercentage * 100) * 100;
        i <= Math.round(upperBarrierPercentage * 100) * 100;
        i += 1
      ) {
        array.push(
          baseYieldPercentage +
            Math.abs(i / 100 / (upperBarrierPercentage * 100)) *
              (maxYield - baseYield) *
              100
        );
      }

      for (let i = 0; i < rightBaseYieldPoints; i += 1) {
        rightArray.push(baseYieldPercentage);
      }
      return [
        ...leftArray,
        baseYieldPercentage,
        ...array,
        baseYieldPercentage,
        ...rightArray,
      ];
    case "rEARN-STETH":
      for (let i = 0; i < leftBaseYieldPoints; i += 1) {
        leftArray.push(baseYieldPercentage);
      }

      for (
        let i = 0;
        i <=
        Math.round((upperBarrierPercentage - lowerBarrierPercentage) * 100) *
          100;
        i += 1
      ) {
        const percentage =
          i /
          (Math.round((upperBarrierPercentage - lowerBarrierPercentage) * 100) *
            100);
        array.push(
          (baseYield +
            (((percentage * (upperBarrierPercentage - lowerBarrierPercentage)) /
              (1 +
                lowerBarrierPercentage +
                percentage *
                  (upperBarrierPercentage - lowerBarrierPercentage))) *
              participationRate +
              1) **
              (365 / 7) -
            1) *
            100
        );
      }

      for (let i = 0; i < rightBaseYieldPoints; i += 1) {
        rightArray.push(baseYieldPercentage);
      }
      return [
        ...leftArray,
        baseYieldPercentage,
        ...array,
        baseYieldPercentage,
        ...rightArray,
      ];
    default:
      return [];
  }
};
