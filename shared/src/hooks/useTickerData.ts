import axios from "axios";
import { useCallback, useEffect, useState } from "react";

import { Assets, AssetsList } from "../store/types";
import { isProduction } from "../utils/env";
import {
  AssetsTickerData,
  defaultAssetTickerData,
} from "./externalAPIDataContext";
import {
  COINGECKO_BASE_URL,
  COINGECKO_CURRENCIES,
  getAssets,
  VaultList,
} from "../constants/constants";

const getTickerData = async (
  currencyName: string
): Promise<{ usd: number; dailyChange: number }> => {
  const apiURL = `${COINGECKO_BASE_URL}/simple/price?ids=${currencyName}&vs_currencies=usd&include_24hr_change=true`;

  const response = await axios.get(apiURL);
  const { data } = response;

  return {
    usd: data[currencyName].usd,
    dailyChange: data[currencyName].usd_24h_change,
  };
};

export const useTickerData = (
  {
    poll,
    pollingFrequency,
  }: {
    poll: boolean;
    pollingFrequency: number;
  } = { poll: true, pollingFrequency: 120000 }
) => {
  const [data, setData] = useState(defaultAssetTickerData);
  const [loading, setLoading] = useState(true);

  // Show only vault-based assets
  const excludedAssets: Assets[] = [];
  VaultList.map((vault) => {
    excludedAssets.push(getAssets(vault));
  });

  const fetchAssetTickers = useCallback(async () => {
    if (!isProduction()) {
      console.time("Ticker Data Fetch");
    }

    const responses = await Promise.all(
      [...AssetsList]
        .filter((asset) => excludedAssets.includes(asset))
        .map(async (asset) => {
          const currencyName = COINGECKO_CURRENCIES[asset];
          return {
            asset,
            data: currencyName
              ? await getTickerData(currencyName)
              : {
                  usd: 0,
                  dailyChange: 0,
                },
          };
        })
    );

    setData(
      Object.fromEntries(
        responses.map((response) => [
          response.asset,
          {
            asset: response.asset,
            price: response.data.usd,
            dailyChange: response.data.dailyChange,
          },
        ])
      ) as AssetsTickerData
    );

    setLoading(false);

    if (!isProduction()) {
      console.timeEnd("Ticker Data Fetch");
    }
  }, []);

  useEffect(() => {
    fetchAssetTickers();

    let pollInterval: any = undefined;

    if (poll) {
      pollInterval = setInterval(fetchAssetTickers, pollingFrequency);
    }

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [fetchAssetTickers, poll, pollingFrequency]);

  return { data, loading };
};
