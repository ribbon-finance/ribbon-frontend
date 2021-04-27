import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import {
  getAirtableName,
  getAssets,
  VaultOptions,
} from "../constants/constants";
import { useGlobalState } from "../store/store";
import { Assets, AssetsList } from "../store/types";

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

type UseHistoricalData = (vaultOption: VaultOptions) => AirtableData;

export const useHistoricalData: UseHistoricalData = (vaultOption) => {
  const airtableName = getAirtableName(vaultOption);
  const API_URL = `https://api.airtable.com/v0/${BASE_ID}/${airtableName}?sort%5B0%5D%5Bfield%5D=Timestamp&sort%5B0%5D%5Bdirection%5D=asc`;

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

type UseLatestAPY = (vaultOption: VaultOptions) => APYData;

export const useLatestAPY: UseLatestAPY = (vaultOption) => {
  const asset = getAssets(vaultOption);
  const [latestAPY, setLatestAPY] = useGlobalState("latestAPY");
  const [fetched, setFetched] = useState<{ [asset in Assets]: boolean }>(
    Object.fromEntries(AssetsList.map((asset) => [asset, false])) as {
      [asset in Assets]: boolean;
    }
  );

  const fetchAirtableData = useCallback(async () => {
    if (fetched[asset]) {
      return;
    }

    const response = await axios.get(
      `https://api.airtable.com/v0/${BASE_ID}/${getAirtableName(
        vaultOption
      )}?sort%5B0%5D%5Bfield%5D=Timestamp&sort%5B0%5D%5Bdirection%5D=desc&maxRecords=1`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    const data = response.data.records;
    const newApy = data[0].fields.APY * 100;

    setFetched((prev) => ({
      ...prev,
      [asset]: true,
    }));
    setLatestAPY((prev) => ({
      ...prev,
      [asset]: newApy,
    }));
  }, [vaultOption, setLatestAPY, asset, fetched]);

  useEffect(() => {
    fetchAirtableData();
  }, [fetchAirtableData]);

  return {
    fetched: fetched[asset],
    res: latestAPY[asset],
  };
};
