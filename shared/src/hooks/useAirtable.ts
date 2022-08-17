import Airtable from "airtable";
import { FieldSet } from "airtable/lib/field_set";
import Record from "airtable/lib/record";
import dotenv from "dotenv";
import { useEffect, useMemo, useState } from "react";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";
import useAssetPrice from "shared/lib/hooks/useAssetPrice";
// import { ScheduleItem } from "./types";

export interface ScheduleItem {
  strikePrice: number;
  baseYield: number;
  participationRate: number;
  barrierPercentage: number;
}

dotenv.config();

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.REACT_APP_AIRTABLE_API_KEY,
});

const BASE_NAME = "Earn";

const base = Airtable.base("appkUHzxJ1lehQTIt");

export const useAirtable = () => {
  const [schedules, setSchedule] = useState<ScheduleItem[]>();
  const [error, setError] = useState<string>();

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
          setSchedule(s);
        }
      })
      .catch((e) => {
        setSchedule([]);
        setError("ERROR FETCHING");
      });
  }, [assetPriceLoading]);

  //   Absolute perf = abs(spot - strike) / strike
  // (Absolute perf * participation rate * 4 + 1)^(365/28) -1
  const [absolutePerformance, expectedYield, maxYield] = useMemo(() => {
    if (!schedules) {
      return [0, 0, 0];
    }
    const absolutePerformance =
      Math.abs(ETHPrice - schedules[0].strikePrice) / schedules[0].strikePrice;

    const calculateMaxYield =
      schedules[0].baseYield +
      (schedules[0].barrierPercentage * schedules[0].participationRate * 4 +
        1) **
        (365 / 28) -
      1;

    const calculateExpectedYield =
      absolutePerformance > schedules[0].barrierPercentage
        ? schedules[0].baseYield
        : schedules[0].baseYield +
          (absolutePerformance * schedules[0].participationRate * 4 + 1) **
            (365 / 28) -
          1;
    return [absolutePerformance, calculateExpectedYield, calculateMaxYield];
  }, [schedules, ETHPrice]);

  if (!schedules) {
    return {
      loading: !schedules,
      strikePrice: 0,
      baseYield: 0,
      participationRate: 0,
      barrierPercentage: 0,
      absolutePerformance: 0,
      expectedYield: 0,
      maxYield: 0,
    };
  }
  return {
    loading: !schedules,
    strikePrice: schedules[0].strikePrice,
    baseYield: schedules[0].baseYield,
    participationRate: schedules[0].participationRate,
    barrierPercentage: schedules[0].barrierPercentage,
    absolutePerformance: absolutePerformance,
    expectedYield: expectedYield,
    maxYield: maxYield,
  };
};
