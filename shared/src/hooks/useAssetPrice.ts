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
  VERCEL_API_BASE_URL,
  COINGECKO_CURRENCIES,
} from "../constants/constants";

const getHistoricalAssetPricesInUSD = async (
  currencyName: string
): Promise<{ price: number; timestamp: number }[]> => {
  const apiURL = `${VERCEL_API_BASE_URL}/coingecko/getHistoricalAssetPricesInUSD/?currency=${currencyName}`;
  const response = await axios.get(apiURL);
  const { data } = response;

  return data.data.prices.map(([timestamp, price]: number[]) => ({
    timestamp,
    price,
  }));
};

interface SimplePriceAPI {
  [key: string]: {
    current_price: number;
    price_change_24h: number;
  };
}

const getLatestPrices = async (assets: string[]): Promise<SimplePriceAPI> => {
  const ids = assets.join("%2C");
  const apiURL = `${VERCEL_API_BASE_URL}/coingecko/getLatestPrices/?ids=${ids}`;
  const response = await axios.get(apiURL);
  const { data } = response;

  return data.data.reduce((obj: any, asset: any) => {
    obj[asset.id] = asset;
    return obj;
  }, {});
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
  const [data, setData] = useState<AssetsPriceData>(defaultAssetsPriceData);

  const fetchAssetsPrices = useCallback(async () => {
    if (!isProduction()) {
      console.time("Asset Price Data Fetch"); // eslint-disable-line
    }

    const assetsBarUSDC = [...AssetsList].filter((asset) => asset !== "USDC");
    const coinIds = assetsBarUSDC
      .map((a) => COINGECKO_CURRENCIES[a] as string)
      .filter(Boolean);

    const latestPrices = await getLatestPrices(coinIds);

    const todayTimestamp = new Date(new Date().toDateString());
    todayTimestamp.setHours(0 - todayTimestamp.getTimezoneOffset() / 60);

    // Default USDC price
    setData((prev) => {
      return {
        ...prev,
        USDC: {
          loading: false,
          latestPrice: 1,
          dailyChange: 0,
          history: Object.fromEntries(
            [...new Array(365)].map((_, index) => [
              todayTimestamp.valueOf() - index * (1000 * 60 * 60 * 24),
              1,
            ])
          ),
        },
      };
    });

    // Load other assets price
    // Break into multiple loops
    const chunkSize = 4;
    for (let i = 0; i < assetsBarUSDC.length; i += chunkSize) {
      const assetsChunk = assetsBarUSDC.slice(i, i + chunkSize);
      if (!isProduction()) {
        console.log("LOADING CHUNK PRICE", assetsChunk);
      }

      assetsChunk.forEach((asset) => {
        const coinId = COINGECKO_CURRENCIES[asset];
        if (coinId) {
          getHistoricalAssetPricesInUSD(coinId).then((data) => {
            setData((prev) => {
              return {
                ...prev,
                [asset]: {
                  loading: false,
                  latestPrice: coinId ? latestPrices[coinId].current_price : 0,
                  dailyChange: coinId
                    ? latestPrices[coinId].price_change_24h
                    : 0,
                  history: Object.fromEntries(
                    data.map((item) => [item.timestamp, item.price])
                  ),
                },
              };
            });
          });
        }
      });

      // Waits 2 seconds before proceeding to next chunk
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

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

  return { data };
};

const useAssetPrice = ({ asset }: { asset: Assets } = { asset: "WETH" }) => {
  const contextData = useContext(ExternalAPIDataContext);

  return {
    price: contextData.assetsPrice.data[asset].latestPrice,
    dailyChange: contextData.assetsPrice.data[asset].dailyChange,
    loading: contextData.assetsPrice.data[asset].loading,
  };
};
export default useAssetPrice;

export const useAssetsPrice = () => {
  const contextData = useContext(ExternalAPIDataContext);

  return {
    prices: Object.fromEntries(
      AssetsList.map((asset) => [
        asset,
        {
          price: contextData.assetsPrice.data[asset].latestPrice,
          dailyChange: contextData.assetsPrice.data[asset].dailyChange,
          loading: contextData.assetsPrice.data[asset].loading,
        },
      ])
    ) as {
      [asset in Assets]: {
        price: number;
        dailyChange: number;
        loading: boolean;
      };
    },
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
        {
          loading: contextData.assetsPrice.data[asset].loading,
          history: contextData.assetsPrice.data[asset].history,
        },
      ])
    ) as {
      [asset in Assets]: {
        loading: boolean;
        history: {
          [timestamp: number]: number;
        };
      };
    },
    searchAssetPriceFromDate,
    searchAssetPriceFromMoment,
    searchAssetPriceFromTimestamp,
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

    const apiURL = `${VERCEL_API_BASE_URL}/coingecko/getAssetInfo/?currency=${COINGECKO_CURRENCIES[asset]}`;
    try {
      setLoading(true);
      const response = await axios.get(apiURL);
      const { data } = response;
      setInfo({
        circulating_supply: data.data.market_data.circulating_supply,
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
