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
};

export const defaultEarnSTETHData: EarnData = {
  loading: true,
  strikePrice: 0,
  baseYield: 0.005,
  participationRate: 0.04,
  lowerBarrierPercentage: -0.05,
  upperBarrierPercentage: 0.15,
  absolutePerformance: 0,
  performance: 0,
  expectedYield: 0,
  maxYield: 0.1633,
  borrowRate: 0.1,
  lowerBarrierETHPrice: 0,
  upperBarrierETHPrice: 0,
  avgPerformance: 0,
};

export const defaultEarnData = (vaultOption: VaultOptions) => {
  switch (vaultOption) {
    case "rEARN-USDC":
      return defaultEarnUSDCData;
    case "rEARN-STETH":
      return defaultEarnSTETHData;
    default:
      return defaultEarnUSDCData;
  }
};
export interface AirtableValues {
  strikePrice: number;
  baseYield: number;
  participationRate: number;
  lowerBarrierPercentage: number;
  upperBarrierPercentage: number;
  borrowRate: number;
}

const airtableValueArray = [
  "strikePrice",
  "baseYield",
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
    case "rEARN-USDC":
      return "EarnTest";
    case "rEARN-STETH":
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
  participationRate: number
) => {
  switch (vault) {
    case "rEARN-USDC":
      return (
        baseYield +
        (upperBarrierPercentage * participationRate * 4 + 1) ** (365 / 28) -
        1
      );
    case "rEARN-STETH":
      return (
        baseYield +
        (((upperBarrierPercentage - lowerBarrierPercentage) /
          (1 + upperBarrierPercentage)) *
          participationRate +
          1) **
          (365 / 7) -
        1
      );
    default:
      return 0;
  }
};
const calculateExpectedYield = (
  vault: VaultOptions,
  baseYield: number,
  lowerBarrierPercentage: number,
  upperBarrierPercentage: number,
  participationRate: number,
  performance: number,
  absolutePerformance: number
) => {
  const performanceBetweenBarriers =
    performance < lowerBarrierPercentage ||
    performance > upperBarrierPercentage;
  switch (vault) {
    case "rEARN-USDC":
      return performanceBetweenBarriers
        ? baseYield
        : baseYield +
            (absolutePerformance * participationRate * 4 + 1) ** (365 / 28) -
            1;
    case "rEARN-STETH":
      return performanceBetweenBarriers
        ? baseYield
        : baseYield +
            (((performance - lowerBarrierPercentage) / (1 + performance)) *
              participationRate +
              1) **
              (365 / 7) -
            1;
    default:
      return 0;
  }
};

export const calculateExpectedYieldSTETH = (
  baseYield: number,
  performance: number,
  lowerBarrierPercentage: number,
  participationRate: number
) => {
  return (
    baseYield +
    (((performance - lowerBarrierPercentage) / (1 + performance)) *
      participationRate +
      1) **
      (365 / 7) -
    1
  );
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
  ] = useMemo(() => {
    if (!values) {
      return [0, 0, 0, 0, 0, 0, 0, 0];
    }
    const rawPerformance = (ETHPrice - values.strikePrice) / values.strikePrice;

    //performance and absolute performance reduced to 4dps
    const performance = Math.round(rawPerformance * 10000) / 10000;

    const absolutePerformance =
      Math.round(Math.abs(rawPerformance) * 10000) / 10000;

    const maxYield = calculateMaxYield(
      vaultOption,
      values.baseYield,
      values.lowerBarrierPercentage,
      values.upperBarrierPercentage,
      values.participationRate
    );

    const expectedYield = calculateExpectedYield(
      vaultOption,
      values.baseYield,
      values.lowerBarrierPercentage,
      values.upperBarrierPercentage,
      values.participationRate,
      performance,
      absolutePerformance
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

    return [
      absolutePerformance,
      performance,
      expectedYield,
      maxYield,
      lowerBarrierETHPrice,
      upperBarrierETHPrice,
      avgPerformance,
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
  } as EarnData;
};
