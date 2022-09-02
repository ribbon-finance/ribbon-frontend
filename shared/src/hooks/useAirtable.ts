import Airtable from "airtable";
import dotenv from "dotenv";
import { useEffect, useMemo, useState } from "react";
import useAssetPrice from "./useAssetPrice";

export interface ScheduleItem {
  strikePrice: number;
  baseYield: number;
  participationRate: number;
  barrierPercentage: number;
  borrowRate: number;
}

dotenv.config();

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.REACT_APP_AIRTABLE_API_KEY,
});

const BASE_NAME = "Earn";

const base = Airtable.base("appkUHzxJ1lehQTIt");

export const useAirtable = () => {
  const [schedule, setSchedule] = useState<ScheduleItem>();
  const [, setError] = useState<string>();

  const { price: ETHPrice, loading: assetPriceLoading } = useAssetPrice({
    asset: "WETH",
  });

  useEffect(() => {
    // 1. When init load schedules
    base(BASE_NAME)
      .select({ view: "Grid view" })
      .all()
      .then((records) => {
        const s: ScheduleItem[] = [];
        records.forEach((record) => {
          const fields = record.fields as unknown;
          const item = fields as ScheduleItem;
          s.push(item);
        });
        if (!assetPriceLoading) {
          setSchedule(s[s.length - 1]);
        }
      })
      .catch((e) => {
        setError("ERROR FETCHING");
      });
  }, [assetPriceLoading]);

  const loading = useMemo(() => {
    return assetPriceLoading || !schedule;
  }, [assetPriceLoading, schedule]);

  //   Absolute perf = abs(spot - strike) / strike
  // (Absolute perf * participation rate * 4 + 1)^(365/28) -1
  const [absolutePerformance, performance, expectedYield, maxYield] =
    useMemo(() => {
      if (!schedule) {
        return [0, 0, 0, 0];
      }
      const absolutePerformance =
        Math.abs(ETHPrice - schedule.strikePrice) / schedule.strikePrice;

      const performance =
        (ETHPrice - schedule.strikePrice) / schedule.strikePrice;

      const calculateMaxYield =
        schedule.baseYield +
        (schedule.barrierPercentage * schedule.participationRate * 4 + 1) **
          (365 / 28) -
        1;

      const calculateExpectedYield =
        absolutePerformance > schedule.barrierPercentage
          ? schedule.baseYield
          : schedule.baseYield +
            (absolutePerformance * schedule.participationRate * 4 + 1) **
              (365 / 28) -
            1;
      return [
        absolutePerformance,
        performance,
        calculateExpectedYield,
        calculateMaxYield,
      ];
    }, [schedule, ETHPrice]);

  if (loading || !schedule) {
    //placeholder values while values are loading
    return {
      loading,
      strikePrice: ETHPrice,
      baseYield: 0.04,
      participationRate: 0.04,
      barrierPercentage: 0.08,
      absolutePerformance: 0.0,
      performance: 0.0,
      expectedYield: 0.0,
      maxYield: 0.1633,
      borrowRate: 0.1,
    };
  }
  return {
    loading,
    strikePrice: schedule.strikePrice,
    baseYield: schedule.baseYield,
    participationRate: schedule.participationRate,
    barrierPercentage: schedule.barrierPercentage,
    absolutePerformance: absolutePerformance,
    performance: performance,
    expectedYield: expectedYield,
    maxYield: maxYield,
    borrowRate: schedule.borrowRate,
  };
};
