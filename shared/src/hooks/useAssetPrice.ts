import axios from "axios";
import { useCallback, useContext, useEffect, useState } from "react";
import { Moment } from "moment";

import { Assets, AssetsList } from "../store/types";
import { isProduction } from "../utils/env";
import {
  AssetsPriceData,
  defaultAssetsPriceData,
  ExternalAPIDataContext,
} from "./externalAPIDataContext";
import {
  COINGECKO_BASE_URL,
  COINGECKO_CURRENCIES,
} from "../constants/constants";

const getHistoricalAssetPricesInUSD = async (
  currencyName: string
): Promise<{ price: number; timestamp: number }[]> => {
  const apiURL = `${COINGECKO_BASE_URL}/coins/${currencyName}/market_chart?vs_currency=usd&days=365&interval=daily`;

  const response = await axios.get(apiURL);
  const { data } = response;

  return data.prices.map(([timestamp, price]: number[]) => ({
    timestamp,
    price,
  }));
};

interface SimplePriceAPI {
  [key: string]: {
    usd: number;
  };
}

const getLatestPrices = async (assets: string[]): Promise<SimplePriceAPI> => {
  const ids = assets.join(",");
  const apiURL = `${COINGECKO_BASE_URL}/simple/price?ids=${ids}&vs_currencies=usd`;

  const response = await axios.get(apiURL);
  const { data } = response;
  return data;
};

export const useFetchAssetsPrice = (
  {
    poll,
    pollingFrequency,
  }: {
    poll: boolean;
    pollingFrequency: number;
  } = { poll: true, pollingFrequency: 120000 }
) => {
  const [data, setData] = useState(defaultAssetsPriceData);
  const [loading, setLoading] = useState(true);

  const fetchAssetsPrices = useCallback(async () => {
    if (!isProduction()) {
      console.time("Asset Price Data Fetch"); // eslint-disable-line
    }

    const assetsBarUSDC = [...AssetsList].filter((asset) => asset !== "USDC");
    const coinIds = assetsBarUSDC
      .map((a) => COINGECKO_CURRENCIES[a] as string)
      .filter(Boolean);

    const responses = await Promise.all(
      assetsBarUSDC.map(async (asset, idx) => {
        const coinId = COINGECKO_CURRENCIES[asset];
        return {
          asset: assetsBarUSDC[idx],
          data: coinId ? await getHistoricalAssetPricesInUSD(coinId) : [],
        };
      })
    );
    const latestPrices = await getLatestPrices(coinIds);

    const todayTimestamp = new Date(new Date().toDateString());
    todayTimestamp.setHours(0 - todayTimestamp.getTimezoneOffset() / 60);

    setData(
      Object.fromEntries(
        responses
          .map((response) => [
            response.asset,
            {
              latestPrice: COINGECKO_CURRENCIES[response.asset]
                ? latestPrices[COINGECKO_CURRENCIES[response.asset] as string]
                    .usd
                : 0,
              history: Object.fromEntries(
                response.data.map((item) => [item.timestamp, item.price])
              ),
            },
          ])
          .concat([
            [
              "USDC",
              {
                latestPrice: 1,
                history: Object.fromEntries(
                  [...new Array(365)].map((_, index) => [
                    todayTimestamp.valueOf() - index * (1000 * 60 * 60 * 24),
                    1,
                  ])
                ),
              },
            ],
          ])
      ) as AssetsPriceData
    );
    setLoading(false);

    if (!isProduction()) {
      console.timeEnd("Asset Price Data Fetch"); // eslint-disable-line
    }
  }, []);

  useEffect(() => {
    fetchAssetsPrices();

    let pollInterval: any = undefined;

    if (poll) {
      pollInterval = setInterval(fetchAssetsPrices, pollingFrequency);
    }

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [fetchAssetsPrices, poll, pollingFrequency]);

  return { data, loading };
};

const useAssetPrice = ({ asset }: { asset: Assets } = { asset: "WETH" }) => {
  const contextData = useContext(ExternalAPIDataContext);

  return {
    price: contextData.assetsPrice.data[asset].latestPrice,
    loading: contextData.assetsPrice.loading,
  };
};
export default useAssetPrice;

export const useAssetsPrice = () => {
  const contextData = useContext(ExternalAPIDataContext);

  return {
    prices: Object.fromEntries(
      AssetsList.map((asset) => [
        asset,
        contextData.assetsPrice.data[asset].latestPrice,
      ])
    ) as { [asset in Assets]: number },
    loading: contextData.assetsPrice.loading,
  };
};

export const useAssetsPriceHistory = () => {
  const contextData = useContext(ExternalAPIDataContext);

  /**
   * Search the price of asset with a given date
   */
  const searchAssetPriceFromDate = useCallback(
    (asset: Assets, date: Date): number => {
      const queryDate = new Date(date.toDateString());
      queryDate.setUTCHours(0);

      return (
        contextData.assetsPrice.data[asset].history[queryDate.valueOf()] || 0
      );
    },
    [contextData.assetsPrice]
  );

  /**
   * Wrapper for price search in the event where moment is provided
   */
  const searchAssetPriceFromMoment = useCallback(
    (asset: Assets, momentObj: Moment) =>
      searchAssetPriceFromDate(asset, momentObj.toDate()),
    [searchAssetPriceFromDate]
  );

  /**
   * Wrapper for price search in the event where timestamp is provided
   */
  const searchAssetPriceFromTimestamp = useCallback(
    (asset: Assets, timestamp: number) =>
      searchAssetPriceFromDate(asset, new Date(timestamp)),
    [searchAssetPriceFromDate]
  );

  return {
    histories: Object.fromEntries(
      AssetsList.map((asset) => [
        asset,
        contextData.assetsPrice.data[asset].history,
      ])
    ) as { [asset in Assets]: { [timestamp: number]: number } },
    searchAssetPriceFromDate,
    searchAssetPriceFromMoment,
    searchAssetPriceFromTimestamp,
    loading: contextData.assetsPrice.loading,
  };
};

interface AssetInfo {
  circulating_supply: number;
}

export const useAssetInfo = (asset: Assets) => {
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<AssetInfo>();

  const fetchAssetInfo = useCallback(async () => {
    if (info) {
      return;
    }

    const apiURL = `${COINGECKO_BASE_URL}/coins/${COINGECKO_CURRENCIES[asset]}`;
    try {
      setLoading(true);
      const response = await axios.get(apiURL);
      const { data } = response;
      setInfo({
        circulating_supply: data.market_data.circulating_supply,
      });
    } catch (error) {
      !isProduction() && console.log("Asset info fetch error:", error); // eslint-disable-line
      setInfo({
        circulating_supply: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [info, asset]);

  useEffect(() => {
    fetchAssetInfo();
  }, [fetchAssetInfo]);

  return {
    info: info || { circulating_supply: 0 },
    loading,
  };
};
