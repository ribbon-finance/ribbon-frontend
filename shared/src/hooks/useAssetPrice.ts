import axios from "axios";
import { useCallback, useContext, useEffect, useState } from "react";

import { Assets, AssetsList } from "../store/types";
import {
  AssetPriceContext,
  AssetPriceResponses,
  defaultAssetPriceContextData,
} from "./assetPriceContext";

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

const COINGECKO_CURRENCIES = {
  WETH: "ethereum",
  WBTC: "wrapped-bitcoin",
  USDC: "usd-coin",
  yvUSDC: undefined,
  stETH: "staked-ether",
};

export const useFetchAssetsPrice = () => {
  const [data, setData] = useState(defaultAssetPriceContextData);

  const fetchAssetsPrices = useCallback(async () => {
    const responses = await Promise.all(
      AssetsList.map(async (asset) => {
        const currencyName = COINGECKO_CURRENCIES[asset];
        return {
          asset,
          data: currencyName ? await getAssetPricesInUSD(currencyName) : [],
        };
      })
    );

    setData({
      responses: Object.fromEntries(
        responses.map((response) => [response.asset, response.data])
      ) as AssetPriceResponses,
      loading: false,
    });
  }, []);

  useEffect(() => {
    fetchAssetsPrices();
  }, [fetchAssetsPrices]);

  console.log(data);

  return data;
};

const useAssetPrice = ({ asset }: { asset: Assets } = { asset: "WETH" }) => {
  const contextData = useContext(AssetPriceContext);

  return {
    price:
      contextData.responses[asset].length > 0
        ? contextData.responses[asset][contextData.responses[asset].length - 1]
            .price
        : 0,
    loading: contextData.loading,
  };
};

export default useAssetPrice;

export const useAssetsPrice = () => {
  const contextData = useContext(AssetPriceContext);

  return {
    prices: Object.fromEntries(
      AssetsList.map((asset) => [
        asset,
        contextData.responses[asset].length > 0
          ? contextData.responses[asset][
              contextData.responses[asset].length - 1
            ].price
          : 0,
      ])
    ) as { [asset in Assets]: number },
    loading: contextData.loading,
  };
};
