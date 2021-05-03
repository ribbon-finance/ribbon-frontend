import axios from "axios";
import { useEffect, useState } from "react";
import { useGlobalState } from "shared/lib/store/store";
import { AssetsList, Assets } from "shared/lib/store/types";

type APIResponse = Record<string, { usd: number }>;

const getAssetPriceInUSD = async (currencyName: string): Promise<number> => {
  const apiURL = `https://api.coingecko.com/api/v3/simple/price?ids=${currencyName}&vs_currencies=usd`;

  const response = await axios.get(apiURL);
  const data: APIResponse = response.data;

  if (data && data[currencyName]) {
    return data[currencyName].usd;
  }
  return 0;
};

const COINGECKO_CURRENCIES = {
  WETH: "ethereum",
  WBTC: "wrapped-bitcoin",
  USDC: "usd-coin",
};

// TODO: We need this global variable so we can prevent over-fetching
const fetchedOnce = Object.fromEntries(
  AssetsList.map((asset) => [asset, false])
);

const useAssetPrice: (args: {
  asset?: Assets;
}) => { price: number; loading: boolean } = ({ asset = "WETH" }) => {
  const [prices, setPrices] = useGlobalState("prices");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    !fetchedOnce[asset] &&
      (async () => {
        if (AssetsList.includes(asset)) {
          fetchedOnce[asset] = true;
          setLoading(true);
          const price = await getAssetPriceInUSD(COINGECKO_CURRENCIES[asset]);
          setPrices((prices) => ({
            ...prices,
            [asset]: price,
          }));
          setLoading(false);
        } else {
          throw new Error(`Unknown asset ${asset}`);
        }
      })();
  }, [asset, setPrices]);

  return { price: prices[asset], loading };
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
        if (fetchedOnce[asset]) {
          return;
        }

        if (AssetsList.includes(asset)) {
          fetchedOnce[asset] = true;
          setLoading(true);
          const price = await getAssetPriceInUSD(COINGECKO_CURRENCIES[asset]);
          setPrices((prices) => ({
            ...prices,
            [asset]: price,
          }));
          setLoading(false);
        } else {
          throw new Error(`Unknown asset ${asset}`);
        }
      })
    );
    setLoading(false);
  }, [assets, setPrices]);

  return {
    prices: Object.fromEntries(assets.map((asset) => [asset, prices[asset]])),
    loading,
  };
};
