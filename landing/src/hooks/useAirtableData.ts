import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useGlobalState } from "../store/store";

interface AirtableData {
  fetched: boolean;
  res: WeeklyPerformance[];
}

interface APYData {
  fetched: boolean;
  res: number;
}

interface WeeklyPerformance {
  apy: number;
  premiums: number;
  principal: number;
  timestamp: string;
  yield: number;
  cumYield: number;
}

const API_KEY = process.env.REACT_APP_AIRTABLE_API_KEY;
const BASE_ID = process.env.REACT_APP_AIRTABLE_BASE_ID;

export const useHistoricalData = () => {
  const API_URL = `https://api.airtable.com/v0/${BASE_ID}/table?sort%5B0%5D%5Bfield%5D=Timestamp&sort%5B0%5D%5Bdirection%5D=asc`;

  const [data, setData] = useState<AirtableData>({
    fetched: false,
    res: [],
  });

  const fetchAirtableData = useCallback(async () => {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    const data = response.data.records;

    // Get cumulative yield
    const weeklyYields = data.map((row: any) => row.fields.WeeklyYield * 100);
    var cumYield: number[] = [];
    weeklyYields.reduce(function (a: any, b: any, i: any) {
      return (cumYield[i] = a + b);
    }, 0);

    const formattedData = data.map(function (row: any, index: number) {
      let formatted: WeeklyPerformance = {
        apy: row.fields.APY * 100,
        premiums: row.fields.Premiums,
        principal: row.fields.Principal,
        timestamp: row.fields.Timestamp,
        yield: row.fields.WeeklyYield,
        cumYield: cumYield[index],
      };
      return formatted;
    });

    setData({
      fetched: true,
      res: formattedData,
    });
  }, [API_URL]);

  useEffect(() => {
    fetchAirtableData();
  }, [fetchAirtableData]);
  return data;
};

type UseLatestAPY = () => APYData;

// We need this global variable so we can prevent over-fetching
let fetchedOnce = false;

export const useLatestAPY: UseLatestAPY = () => {
  const API_URL = `https://api.airtable.com/v0/${BASE_ID}/table?sort%5B0%5D%5Bfield%5D=Timestamp&sort%5B0%5D%5Bdirection%5D=desc&maxRecords=1`;
  const [latestAPY, setLatestAPY] = useGlobalState("latestAPY");
  const [fetched, setFetched] = useState(false);

  const fetchAirtableData = useCallback(async () => {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    const data = response.data.records;
    const latestAPY = data[0].fields.APY * 100;

    setFetched(true);
    setLatestAPY(latestAPY);
  }, [API_URL, setLatestAPY]);

  useEffect(() => {
    if (!latestAPY && !fetchedOnce) {
      fetchedOnce = true;
      fetchAirtableData();
    }
  }, [fetchAirtableData, latestAPY]);

  return {
    fetched,
    res: latestAPY,
  };
};
