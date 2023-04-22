import { VaultOptions } from "shared/lib/constants/constants";
import {
  calculateExpectedYield,
  calculateExpectedYieldSTETH,
} from "shared/lib/hooks/useAirtableEarnData";

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
  performance: number,
  vaultOption: VaultOptions
) => {
  switch (vaultOption) {
    case "rEARN":
      if (hoverPercentage) {
        return isPerformanceOutsideBarriers(
          hoverPercentage,
          lowerBarrierPercentage,
          upperBarrierPercentage
        )
          ? 0
          : hoverPercentage + 1;
      } else {
        return isPerformanceOutsideBarriers(
          performance,
          lowerBarrierPercentage,
          upperBarrierPercentage
        )
          ? 0
          : (performance + 1) / 1;
      }
    case "rEARN-stETH":
      if (hoverPercentage) {
        return isPerformanceOutsideBarriers(
          hoverPercentage,
          lowerBarrierPercentage,
          upperBarrierPercentage
        )
          ? 0
          : (hoverPercentage + 1) / (1 + lowerBarrierPercentage);
      } else {
        return isPerformanceOutsideBarriers(
          performance,
          lowerBarrierPercentage,
          upperBarrierPercentage
        )
          ? 0
          : (performance + 1) / (1 + lowerBarrierPercentage);
      }
    default:
      return 0;
  }
};

const getLeftBaseYieldPoints = (vaultOption: VaultOptions) => {
  switch (vaultOption) {
    case "rEARN":
      return 1000;
    case "rEARN-stETH":
      return 2000;
    default:
      return 0;
  }
};

const getRightBaseYieldPoints = (vaultOption: VaultOptions) => {
  switch (vaultOption) {
    case "rEARN":
      return 1000;
    case "rEARN-stETH":
      return 2000;
    default:
      return 0;
  }
};

// precalculate difference between
// number of points between lowerBarrierPercentage and 0 and
// number of points between 0 and upperBarrierpercentage
const getExtraPoints = (
  lowerBarrierPercentage: number,
  upperBarrierPercentage: number,
  isUpperBarrier: boolean,
  isUpperBarrierHigher: boolean
) => {
  const differenceInPoints = Math.round(
    Math.abs(lowerBarrierPercentage + upperBarrierPercentage) * 10000
  );
  if (isUpperBarrier) {
    return isUpperBarrierHigher ? 0 : differenceInPoints;
  } else {
    return isUpperBarrierHigher ? differenceInPoints : 0;
  }
};

export const getOptionMoneynessRange = (
  vaultOption: VaultOptions,
  lowerBarrierPercentage: number,
  upperBarrierPercentage: number,
  isUpperBarrierHigher: boolean
) => {
  let leftArray = [];
  let array = [];
  let rightArray = [];

  const extraLeftBaseYieldPoints = getExtraPoints(
    lowerBarrierPercentage,
    upperBarrierPercentage,
    false,
    isUpperBarrierHigher
  );
  const extraRightBaseYieldPoints = getExtraPoints(
    lowerBarrierPercentage,
    upperBarrierPercentage,
    true,
    isUpperBarrierHigher
  );
  const leftBaseYieldPoints = getLeftBaseYieldPoints(vaultOption);
  const rightBaseYieldPoints = getRightBaseYieldPoints(vaultOption);
  switch (vaultOption) {
    case "rEARN":
      // points that represent the moneyness below lower barrier
      for (
        let i = 0;
        i < leftBaseYieldPoints + extraLeftBaseYieldPoints;
        i += 1
      ) {
        leftArray.push(
          Math.round(lowerBarrierPercentage * 10000) / 100 -
            (leftBaseYieldPoints + extraLeftBaseYieldPoints - i) / 100
        );
      }

      // points that represent the moneyness between barriers
      for (
        let i = Math.round(lowerBarrierPercentage * 10000);
        i <= Math.round(upperBarrierPercentage * 10000);
        i += 1
      ) {
        array.push(i / 100);
      }

      // points that represent the moneyness above upper barrier
      for (
        let i = 0;
        i < rightBaseYieldPoints + extraRightBaseYieldPoints;
        i += 1
      ) {
        rightArray.push(
          Math.round(upperBarrierPercentage * 10000) / 100 + (i + 1) / 100
        );
      }

      return [...leftArray, ...array, ...rightArray];
    case "rEARN-stETH":
      // points that represent the moneyness below lower barrier
      for (let i = 0; i < leftBaseYieldPoints; i += 1) {
        leftArray.push(
          Math.round(lowerBarrierPercentage * 10000) / 100 -
            (leftBaseYieldPoints - i) / 100
        );
      }

      // points that represent the moneyness when between barriers
      for (
        let i = Math.round(lowerBarrierPercentage * 10000);
        i <= Math.round(upperBarrierPercentage * 10000);
        i += 1
      ) {
        array.push(i / 100);
      }

      // points that represent the moneyness above upper barrier
      for (let i = 0; i < rightBaseYieldPoints; i += 1) {
        rightArray.push(
          Math.round(upperBarrierPercentage * 10000) / 100 + (i + 1) / 100
        );
      }

      return [...leftArray, ...array, ...rightArray];
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
  participationRate: number,
  optionPrice: number,
  lowerBarrierMaxYield: number,
  upperBarrierMaxYield: number,
  isUpperBarrierHigher: boolean
) => {
  let leftArray = [];
  let array = [];
  let rightArray = [];
  const leftBaseYieldPoints = getLeftBaseYieldPoints(vaultOption);
  const rightBaseYieldPoints = getRightBaseYieldPoints(vaultOption);
  const baseYieldPercentage = baseYield * 100;
  switch (vaultOption) {
    case "rEARN":
      // precalculate difference between
      // number of points between lowerBarrierPercentage and 0 and
      // number of points between 0 and upperBarrierpercentage
      const extraLeftBaseYieldPoints = getExtraPoints(
        lowerBarrierPercentage,
        upperBarrierPercentage,
        false,
        isUpperBarrierHigher
      );
      const extraRightBaseYieldPoints = getExtraPoints(
        lowerBarrierPercentage,
        upperBarrierPercentage,
        true,
        isUpperBarrierHigher
      );
      const absoluteLowerBarrierPercentage = Math.abs(lowerBarrierPercentage);
      // points that represent the base yield below lower barrier
      // add extra base yield points if the side's barrier is smaller
      // to keep the graph centered
      for (
        let i = 0;
        i < leftBaseYieldPoints + extraLeftBaseYieldPoints;
        i += 1
      ) {
        leftArray.push(baseYieldPercentage);
      }
      // points that represent the expected yield as spotPrice goes from
      // lowerBarrierPercentage to 0
      for (
        let i = 0;
        i < Math.round(absoluteLowerBarrierPercentage * 10000);
        i += 1
      ) {
        const maxYieldBaseYieldDiff = lowerBarrierMaxYield - baseYield;
        array.push(
          maxYieldBaseYieldDiff * 100 -
            (i / Math.round(absoluteLowerBarrierPercentage * 10000)) *
              maxYieldBaseYieldDiff *
              100 +
            baseYield * 100
        );
      }
      // points that represent the expected yield as spotPrice goes from
      // 0 to upperBarrierPercentage
      for (let i = 0; i <= Math.round(upperBarrierPercentage * 10000); i += 1) {
        const maxYieldBaseYieldDiff = upperBarrierMaxYield - baseYield;
        array.push(
          baseYield * 100 +
            (i / Math.round(upperBarrierPercentage * 10000)) *
              maxYieldBaseYieldDiff *
              100
        );
      }

      // points that represent the base yield above upper barrier
      // add extra base yield points if the side's barrier is smaller
      // to keep the graph centered
      for (
        let i = 0;
        i < rightBaseYieldPoints + extraRightBaseYieldPoints;
        i += 1
      ) {
        rightArray.push(baseYieldPercentage);
      }
      return [...leftArray, ...array, ...rightArray];
    case "rEARN-stETH":
      // points that represent the base yield below lower barrier
      for (let i = 0; i < leftBaseYieldPoints + 1; i += 1) {
        leftArray.push(
          calculateExpectedYieldSTETH(
            baseYield,
            0,
            lowerBarrierPercentage,
            participationRate,
            optionPrice
          ) * 100
        );
      }

      const barriersSum = upperBarrierPercentage - lowerBarrierPercentage;

      // we multiply the number by 10000 to make plotting easier
      const barriersSumLargeNumber = Math.round(barriersSum * 10000);

      // points that represent the expected yield between barriers
      // add incremental amounts of expected yield from base yield to max yield
      for (let i = 0; i <= barriersSumLargeNumber; i += 1) {
        const performance =
          i + Math.round((lowerBarrierPercentage + 1) * 10000);
        const optionPayout =
          (performance - Math.round((lowerBarrierPercentage + 1) * 10000)) /
          performance;
        array.push(
          calculateExpectedYieldSTETH(
            baseYield,
            optionPayout,
            lowerBarrierPercentage,
            participationRate,
            optionPrice
          ) * 100
        );
      }

      // points that represent the base yield above upper barrier
      for (let i = 0; i < rightBaseYieldPoints + 1; i += 1) {
        rightArray.push(
          calculateExpectedYieldSTETH(
            baseYield,
            0,
            lowerBarrierPercentage,
            participationRate,
            optionPrice
          ) * 100
        );
      }
      return [...leftArray, ...array, ...rightArray];
    default:
      return [];
  }
};

export const getExpectedPrincipalReturnRange = (
  vaultOption: VaultOptions,
  lowerBarrierPercentage: number,
  upperBarrierPercentage: number,
  maxYield: number,
  baseYield: number,
  participationRate: number,
  optionPrice: number
) => {
  let leftArray = [];
  let array = [];
  let rightArray = [];
  const leftBaseYieldPoints = getLeftBaseYieldPoints(vaultOption);
  const rightBaseYieldPoints = getRightBaseYieldPoints(vaultOption);
  // points that represent the base yield below lower barrier
  for (let i = 0; i < leftBaseYieldPoints + 1; i += 1) {
    leftArray.push(
      calculateExpectedYield(
        vaultOption,
        baseYield,
        lowerBarrierPercentage,
        upperBarrierPercentage,
        participationRate,
        -1,
        0,
        optionPrice
      ) * 100
    );
  }

  const barriersSum = upperBarrierPercentage - lowerBarrierPercentage;

  // we multiply the number by 10000 to make plotting easier
  const barriersSumLargeNumber = Math.round(barriersSum * 10000);

  // points that represent the expected yield between barriers
  // add incremental amounts of expected yield from base yield to max yield
  for (let i = 0; i <= barriersSumLargeNumber; i += 1) {
    const performance = i + Math.round((lowerBarrierPercentage + 1) * 10000);
    const optionPayout =
      (performance - Math.round((lowerBarrierPercentage + 1) * 10000)) /
      performance;
    array.push(
      calculateExpectedYield(
        vaultOption,
        baseYield,
        lowerBarrierPercentage,
        upperBarrierPercentage,
        participationRate,
        optionPayout,
        0,
        optionPrice
      ) * 100
    );
  }

  // points that represent the base yield above upper barrier
  for (let i = 0; i < rightBaseYieldPoints + 1; i += 1) {
    rightArray.push(
      calculateExpectedYield(
        vaultOption,
        baseYield,
        lowerBarrierPercentage,
        upperBarrierPercentage,
        participationRate,
        -1,
        0,
        optionPrice
      ) * 100
    );
  }
  return [...leftArray, ...array, ...rightArray];
};
