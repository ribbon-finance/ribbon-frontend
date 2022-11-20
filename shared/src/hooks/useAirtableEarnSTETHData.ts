import Airtable from "airtable";
import { useEffect, useMemo, useState } from "react";
import useAssetPrice from "./useAssetPrice";

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

const recordHasUndefined = (recordTemp: any): boolean => {
  for (const key in airtableValueArray) {
    if (recordTemp.fields[airtableValueArray[key]] === undefined) {
      return true;
    }
  }
  return false;
};

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.REACT_APP_AIRTABLE_API_KEY,
});

const BASE_NAME = "EarnSTETH";

const base = Airtable.base("appkUHzxJ1lehQTIt");

export const useAirtableEarnSTETHData = () => {
  const [values, setValues] = useState<AirtableValues>();
  const [itmRecords, setItmRecords] = useState<any>([]);
  const [, setError] = useState<string>();

  const { price: ETHPrice2, loading: assetPriceLoading } = useAssetPrice({
    asset: "WETH",
  });

  const ETHPrice = 1360;
  useEffect(() => {
    // 1. When init load schedules
    base(BASE_NAME)
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
  }, [assetPriceLoading]);
  const loading = useMemo(() => {
    return assetPriceLoading || !values;
  }, [assetPriceLoading, values]);

  //   Absolute perf = abs(spot - strike) / strike
  // (Absolute perf * participation rate * 4 + 1)^(365/28) -1
  const [
    performance,
    expectedYield,
    maxYield,
    ethLowerBarrier,
    ethUpperBarrier,
    itmPerformance,
  ] = useMemo(() => {
    if (!values) {
      return [0, 0, 0, 0, 0, 0, 0];
    }
    const rawPerformance = (ETHPrice - values.strikePrice) / values.strikePrice;

    //performance reduced to 4dps
    const performance = Math.round(rawPerformance * 10000) / 10000;

    const calculateMaxYield =
      values.baseYield +
      ((values.upperBarrierPercentage - values.lowerBarrierPercentage) *
        values.participationRate *
        4 +
        1) **
        (365 / 28) -
      1;

    const calculateExpectedYield =
      performance < values.lowerBarrierPercentage ||
      performance > values.upperBarrierPercentage
        ? values.baseYield
        : values.baseYield +
          ((performance - values.lowerBarrierPercentage) *
            values.participationRate *
            4 +
            1) **
            (365 / 28) -
          1;

    const ethPriceLower =
      values.strikePrice * (1 - values.lowerBarrierPercentage);
    const ethPriceUpper =
      values.strikePrice * (1 + values.upperBarrierPercentage);

    let itmPerformanceArray: number[] = [];
    itmRecords.forEach((record: any) => {
      itmPerformanceArray.push(
        Math.abs(
          (record.fields!.expiryPrice - record.fields!.strikePrice) /
            record.fields!.strikePrice
        )
      );
    });
    const itmAvgPerformance =
      itmPerformanceArray.reduce((partialSum, a) => partialSum + a, 0) /
      itmPerformanceArray.length;

    return [
      performance,
      calculateExpectedYield,
      calculateMaxYield,
      ethPriceLower,
      ethPriceUpper,
      itmAvgPerformance,
    ];
  }, [values, ETHPrice, itmRecords]);

  if (loading || !values) {
    //placeholder values while values are loading
    return {
      loading,
      strikePrice: ETHPrice,
      baseYield: 0.04,
      participationRate: 0.04,
      lowerBarrierPercentage: -0.05,
      upperBarrierPercentage: 0.15,
      performance: 0.0,
      expectedYield: 0.0,
      maxYield: 0.1633,
      borrowRate: 0.1,
      ethLowerBarrier: 0,
      ethUpperBarrier: 0,
      itmPerformance: 0.0,
    };
  }
  return {
    loading,
    strikePrice: values.strikePrice,
    baseYield: values.baseYield,
    participationRate: values.participationRate,
    lowerBarrierPercentage: values.lowerBarrierPercentage,
    upperBarrierPercentage: values.upperBarrierPercentage,
    performance,
    expectedYield,
    maxYield,
    borrowRate: values.borrowRate,
    ethLowerBarrier,
    ethUpperBarrier,
    itmPerformance,
  };
};
