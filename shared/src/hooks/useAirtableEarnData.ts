import Airtable from "airtable";
import { useEffect, useMemo, useState } from "react";
import { VaultOptions } from "../constants/constants";
import useAssetPrice from "./useAssetPrice";

export type EarnData = {
  loading: boolean;
  strikePrice: number;
  baseYield: number;
  participationRate: number;
  lowerBarrierPercentage: number;
  upperBarrierPercentage: number;
  performance: number;
  absolutePerformance: number;
  expectedYield: number;
  maxYield: number;
  borrowRate: number;
  lowerBarrierETHPrice: number;
  upperBarrierETHPrice: number;
  avgPerformance: number;
  optionPrice: number;
  numericalPerformance: number;
  lowerBarrierMaxYield: number;
  upperBarrierMaxYield: number;
  isUpperBarrierHigher: boolean;
};

export const defaultEarnUSDCData: EarnData = {
  loading: true,
  strikePrice: 0,
  baseYield: 0.04,
  participationRate: 0.04,
  lowerBarrierPercentage: -0.08,
  upperBarrierPercentage: 0.08,
  absolutePerformance: 0,
  performance: 0,
  expectedYield: 0,
  maxYield: 0.1633,
  borrowRate: 0.1,
  lowerBarrierETHPrice: 0,
  upperBarrierETHPrice: 0,
  avgPerformance: 0,
  optionPrice: 0.0267,
  numericalPerformance: 0,
  lowerBarrierMaxYield: 0.08,
  upperBarrierMaxYield: 0.08,
  isUpperBarrierHigher: true,
};

export const defaultEarnSTETHData: EarnData = {
  loading: true,
  strikePrice: 0,
  baseYield: 0.0075,
  participationRate: 0.04,
  lowerBarrierPercentage: -0.1,
  upperBarrierPercentage: 0.1,
  absolutePerformance: 0,
  performance: 0,
  expectedYield: 0,
  maxYield: 0.1633,
  borrowRate: 0.1,
  lowerBarrierETHPrice: 0,
  upperBarrierETHPrice: 0,
  avgPerformance: 0,
  optionPrice: 0.087,
  numericalPerformance: 0,
  lowerBarrierMaxYield: 0.08,
  upperBarrierMaxYield: 0.08,
  isUpperBarrierHigher: true,
};

export const defaultEarnData = (vaultOption: VaultOptions) => {
  switch (vaultOption) {
    case "rEARN":
      return defaultEarnUSDCData;
    case "rEARN-stETH":
      return defaultEarnSTETHData;
    default:
      return defaultEarnUSDCData;
  }
};
export interface AirtableValues {
  strikePrice: number;
  baseYield: number;
  optionPrice: number;
  participationRate: number;
  lowerBarrierPercentage: number;
  upperBarrierPercentage: number;
  borrowRate: number;
}

const airtableValueArray = [
  "strikePrice",
  "baseYield",
  "optionPrice",
  "participationRate",
  "lowerBarrierPercentage",
  "upperBarrierPercentage",
  "borrowRate",
];

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.REACT_APP_AIRTABLE_API_KEY,
});

const baseName = (vault: VaultOptions) => {
  switch (vault) {
    case "rEARN":
      return "Earn";
    case "rEARN-stETH":
      return "EarnSTETH";
    default:
      return "EarnTest";
  }
};

const base = Airtable.base("appkUHzxJ1lehQTIt");

const recordHasUndefined = (recordTemp: any): boolean => {
  for (const key in airtableValueArray) {
    if (recordTemp.fields[airtableValueArray[key]] === undefined) {
      return true;
    }
  }
  return false;
};

const calculateMaxYield = (
  vault: VaultOptions,
  baseYield: number,
  lowerBarrierPercentage: number,
  upperBarrierPercentage: number,
  participationRate: number,
  optionPrice: number
) => {
  switch (vault) {
    case "rEARN":
      return (
        baseYield +
        (upperBarrierPercentage * participationRate + 1) ** (365.25 / 7) -
        1
      );
    case "rEARN-stETH":
      const loanAPR = 0.048;
      const performance =
        (1 + upperBarrierPercentage - (1 + lowerBarrierPercentage)) /
        (1 + upperBarrierPercentage);
      const apy =
        (1 +
          ((((performance - optionPrice) * participationRate * 365.25) / 7 +
            loanAPR) *
            7) /
            365.25) **
          (365.25 / 7) -
        1;
      return apy;
    default:
      return 0;
  }
};

export const calculateExpectedYield = (
  vault: VaultOptions,
  baseYield: number,
  lowerBarrierPercentage: number,
  upperBarrierPercentage: number,
  participationRate: number,
  performance: number,
  absolutePerformance: number,
  optionPrice: number
) => {
  const performanceBetweenBarriers =
    performance < lowerBarrierPercentage ||
    performance > upperBarrierPercentage;
  const performanceBetweenBarriersSteth =
    performance <=
      (1 + upperBarrierPercentage - (1 + lowerBarrierPercentage)) /
        (1 + upperBarrierPercentage) && performance >= 0;
  switch (vault) {
    case "rEARN":
      return performanceBetweenBarriers
        ? baseYield
        : baseYield +
            (absolutePerformance * participationRate + 1) ** (365.25 / 7) -
            1;
    case "rEARN-stETH":
      const loanAPR = 0.048;
      return performanceBetweenBarriersSteth
        ? 1 +
            ((loanAPR * 7) / 365.25 +
              (performance - optionPrice) * participationRate)
        : 0.995;

    default:
      return 0;
  }
};

export const calculateExpectedYieldSTETH = (
  baseYield: number,
  performance: number,
  lowerBarrierPercentage: number,
  participationRate: number,
  optionPrice: number
) => {
  const loanAPR = 0.048;
  const apy =
    (1 +
      ((((performance - optionPrice) * participationRate * 365.25) / 7 +
        loanAPR) *
        7) /
        365.25) **
      (365.25 / 7) -
    1;
  return apy;
};

export const useAirtableEarnData = (vaultOption: VaultOptions) => {
  const [values, setValues] = useState<AirtableValues>();
  const [itmRecords, setItmRecords] = useState<any>([]);
  const [, setError] = useState<string>();

  const { price: ETHPrice, loading: assetPriceLoading } = useAssetPrice({
    asset: "WETH",
  });

  useEffect(() => {
    // 1. When init load schedules
    base(baseName(vaultOption))
      .select({ view: "Grid view" })
      .all()
      .then((records) => {
        // check for undefined rows in airtable
        const filteredRecords = records.filter(
          (record) => !recordHasUndefined(record)
        );
        const fields = filteredRecords[filteredRecords.length - 1]
          .fields as unknown;
        const item = fields as AirtableValues;
        if (!assetPriceLoading) {
          setValues(item);
        }

        const itmRecords = records.filter(
          (record) => record.fields!.expiryPrice !== undefined
        );
        setItmRecords(itmRecords);
      })
      .catch((e) => {
        setError("ERROR FETCHING");
      });
  }, [assetPriceLoading, vaultOption]);

  const loading = useMemo(() => {
    return assetPriceLoading || !values;
  }, [assetPriceLoading, values]);

  const [
    absolutePerformance,
    performance,
    expectedYield,
    maxYield,
    lowerBarrierETHPrice,
    upperBarrierETHPrice,
    avgPerformance,
    numericalPerformance,
    lowerBarrierMaxYield,
    upperBarrierMaxYield,
    isUpperBarrierHigher,
  ] = useMemo(() => {
    if (!values) {
      return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true];
    }
    let rawPerformance: number;
    switch (vaultOption) {
      case "rEARN":
        rawPerformance = (ETHPrice - values.strikePrice) / values.strikePrice;
        break;
      case "rEARN-stETH":
        rawPerformance =
          ((ETHPrice -
            values.strikePrice * (1 + values.lowerBarrierPercentage)) /
            values.strikePrice) *
          (1 + values.lowerBarrierPercentage);
        break;
      default:
        rawPerformance = 0;
    }

    //performance and absolute performance reduced to 4dps
    const performance = Math.round(rawPerformance * 10000) / 10000;

    const absolutePerformance =
      Math.round(Math.abs(rawPerformance) * 10000) / 10000;

    //hardcode rEARN for first week
    const maxYield = calculateMaxYield(
      vaultOption,
      values.baseYield,
      values.lowerBarrierPercentage,
      values.upperBarrierPercentage,
      values.participationRate,
      values.optionPrice
    );

    const expectedYield = calculateExpectedYield(
      vaultOption,
      values.baseYield,
      values.lowerBarrierPercentage,
      values.upperBarrierPercentage,
      values.participationRate,
      performance,
      absolutePerformance,
      values.optionPrice
    );

    const lowerBarrierETHPrice =
      values.strikePrice * (1 + values.lowerBarrierPercentage);
    const upperBarrierETHPrice =
      values.strikePrice * (1 + values.upperBarrierPercentage);

    // calculate the average weekly performance of vault
    let avgPerformanceArray: number[] = [];
    itmRecords.forEach((record: any) => {
      avgPerformanceArray.push(
        Math.abs(
          (record.fields!.expiryPrice - record.fields!.strikePrice) /
            record.fields!.strikePrice
        )
      );
    });
    const avgPerformance =
      avgPerformanceArray.reduce((partialSum, a) => partialSum + a, 0) /
      avgPerformanceArray.length;

    // this performance is just for the graph
    const numericalPerformance =
      Math.round(
        ((ETHPrice - values.strikePrice) / values.strikePrice) * 10000
      ) / 10000;

    const upperBarrierHigher =
      values.upperBarrierPercentage > Math.abs(values.lowerBarrierPercentage);
    // get the lower of the two barrier's max yield
    const lowerBarrierMaxYield = upperBarrierHigher
      ? maxYield *
        Math.abs(values.lowerBarrierPercentage / values.upperBarrierPercentage)
      : maxYield;
    const upperBarrierMaxYield = upperBarrierHigher
      ? maxYield
      : (maxYield * values.upperBarrierPercentage) /
        Math.abs(values.lowerBarrierPercentage);

    return [
      absolutePerformance,
      performance,
      expectedYield,
      maxYield,
      lowerBarrierETHPrice,
      upperBarrierETHPrice,
      isNaN(avgPerformance) ? 0 : avgPerformance,
      numericalPerformance,
      lowerBarrierMaxYield,
      upperBarrierMaxYield,
      values.upperBarrierPercentage > Math.abs(values.lowerBarrierPercentage),
    ];
  }, [values, ETHPrice, vaultOption, itmRecords]);

  if (loading || !values) {
    //placeholder values while values are loading
    return defaultEarnData(vaultOption);
  }

  return {
    loading,
    strikePrice: values.strikePrice,
    baseYield: values.baseYield,
    participationRate: values.participationRate,
    lowerBarrierPercentage: values.lowerBarrierPercentage,
    upperBarrierPercentage: values.upperBarrierPercentage,
    absolutePerformance,
    performance,
    expectedYield,
    maxYield,
    borrowRate: values.borrowRate,
    lowerBarrierETHPrice,
    upperBarrierETHPrice,
    avgPerformance,
    numericalPerformance,
    optionPrice: values.optionPrice,
    lowerBarrierMaxYield,
    upperBarrierMaxYield,
    isUpperBarrierHigher,
  } as EarnData;
};
