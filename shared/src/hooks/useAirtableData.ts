import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import {
  getAirtableName,
  VaultList,
  VaultOptions,
} from "../constants/constants";
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
    const cumYield: number[] = [];
    weeklyYields.reduce((a: any, b: any, i: any) => (cumYield[i] = a + b), 0);

    const formattedData = data.map((row: any, index: number) => {
      const formatted: WeeklyPerformance = {
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
  const [latestAPY, setLatestAPY] = useGlobalState("latestAPY");
  const [fetched, setFetched] = useState<{ [option in VaultOptions]: boolean }>(
    Object.fromEntries(VaultList.map((option) => [option, false])) as {
      [option in VaultOptions]: boolean;
    }
  );

  const fetchAirtableData = useCallback(async () => {
    if (fetched[vaultOption]) {
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
      [vaultOption]: true,
    }));
    setLatestAPY((prev) => ({
      ...prev,
      [vaultOption]: newApy,
    }));
  }, [vaultOption, setLatestAPY, fetched]);

  useEffect(() => {
    fetchAirtableData();
  }, [fetchAirtableData]);

  return {
    fetched: fetched[vaultOption],
    res: latestAPY[vaultOption],
  };
};

export const useLatestAPYs = (vaultOptions: VaultOptions[]) => {
  const [latestAPY, setLatestAPY] = useGlobalState("latestAPY");
  const [fetched, setFetched] = useState<{ [option in VaultOptions]: boolean }>(
    Object.fromEntries(VaultList.map((option) => [option, false])) as {
      [option in VaultOptions]: boolean;
    }
  );

  const fetchAirtableData = useCallback(async () => {
    vaultOptions.forEach(async (vaultOption) => {
      if (fetched[vaultOption]) {
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
        [vaultOption]: true,
      }));
      setLatestAPY((prev) => ({
        ...prev,
        [vaultOption]: newApy,
      }));
    });
  }, [vaultOptions, setLatestAPY, fetched]);

  useEffect(() => {
    fetchAirtableData();
  }, [fetchAirtableData]);

  return Object.fromEntries(
    vaultOptions.map((vaultOption) => [
      vaultOption,
      {
        fetched: fetched[vaultOption],
        res: latestAPY[vaultOption],
      },
    ])
  );
};
