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

const getAssetPricesInUSD = async (
  currencyName: string
): Promise<{ price: number; timestamp: number }[]> => {
  const apiURL = `https://api.coingecko.com/api/v3/coins/${currencyName}/market_chart?vs_currency=usd&days=365&interval=daily`;

  const response = await axios.get(apiURL);
  const { data } = response;

  return data.prices.map((price: number[]) => ({
    timestamp: price[0],
    price: price[1],
  }));
};

const COINGECKO_CURRENCIES: { [key in Assets]: string | undefined } = {
  WETH: "ethereum",
  WBTC: "wrapped-bitcoin",
  USDC: "usd-coin",
  yvUSDC: undefined,
  stETH: "staked-ether",
  wstETH: "wrapped-steth",
  LDO: "lido-dao",
  AAVE: "aave",
  WAVAX: "avalanche-2",
  PERP: "perpetual-protocol",
  RBN: "ribbon-finance",
  veRBN: undefined,
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
      console.time("Asset Price Data Fetch");
    }

    const responses = await Promise.all(
      [...AssetsList]
        .filter((asset) => asset !== "USDC")
        .map(async (asset) => {
          const currencyName = COINGECKO_CURRENCIES[asset];
          return {
            asset,
            data: currencyName ? await getAssetPricesInUSD(currencyName) : [],
          };
        })
    );

    const todayTimestamp = new Date(new Date().toDateString());
    todayTimestamp.setHours(0 - todayTimestamp.getTimezoneOffset() / 60);

    setData(
      Object.fromEntries(
        responses
          .map((response) => [
            response.asset,
            {
              latestPrice:
                response.data.length > 0
                  ? response.data[response.data.length - 1].price
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
      console.timeEnd("Asset Price Data Fetch");
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
