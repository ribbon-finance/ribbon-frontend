import axios from "axios";
import { useEffect, useState } from "react";

import { useGlobalState } from "../store/store";
import { Assets, AssetsList } from "../store/types";

const getAssetPriceInUSD = async (currencyName: string): Promise<number> => {
  const apiURL = `https://api.coingecko.com/api/v3/simple/price?ids=${currencyName}&vs_currencies=usd`;

  const response = await axios.get(apiURL);
  const { data } = response;

  if (data && data[currencyName]) {
    return data[currencyName].usd;
  }
  return 0;
};

const COINGECKO_CURRENCIES = {
  WETH: "ethereum",
  WBTC: "wrapped-bitcoin",
  USDC: "usd-coin",
  yvUSDC: "",
};

const useAssetPrice: (args: {
  asset?: Assets;
}) => { price: number; loading: boolean } = ({ asset = "WETH" }) => {
  const [prices, setPrices] = useGlobalState("prices");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    !prices[asset].fetched &&
      (async () => {
        if (AssetsList.includes(asset)) {
          setLoading(true);
          const price = await getAssetPriceInUSD(COINGECKO_CURRENCIES[asset]);
          setPrices((prices) => ({
            ...prices,
            [asset]: { price, fetched: true },
          }));
          setLoading(false);
        } else {
          throw new Error(`Unknown asset ${asset}`);
        }
      })();
  }, [asset, prices, setPrices]);

  return { price: prices[asset].price, loading };
};
export default useAssetPrice;

export const useAssetsPrice: (args: {
  assets: Assets[];
}) => { prices: Partial<{ [asset in Assets]: number }>; loading: boolean } = ({
  assets = ["WETH"],
}) => {
  const [prices, setPrices] = useGlobalState("prices");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all(
      assets.map(async (asset) => {
        if (prices[asset].fetched) {
          return;
        }

        if (AssetsList.includes(asset)) {
          setLoading(true);
          const price = await getAssetPriceInUSD(COINGECKO_CURRENCIES[asset]);
          setPrices((prices) => ({
            ...prices,
            [asset]: {
              price,
              fetched: true,
            },
          }));
          setLoading(false);
        } else {
          throw new Error(`Unknown asset ${asset}`);
        }
      })
    );
    setLoading(false);
  }, [assets, prices, setPrices]);

  return {
    prices: Object.fromEntries(
      assets.map((asset) => [asset, prices[asset].price])
    ),
    loading,
  };
};
