import axios from "axios";
import { useEffect, useState } from "react";
import { useGlobalState } from "../store/store";

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

type Assets = "WETH";

const COINGECKO_CURRENCIES = {
  WETH: "ethereum",
};

// We need this global variable so we can prevent over-fetching
let fetchedOnce = false;

const useAssetPrice: (args: {
  asset?: Assets;
}) => { price: number; loading: boolean } = ({ asset = "WETH" }) => {
  const [prices, setPrices] = useGlobalState("prices");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    !fetchedOnce &&
      (async () => {
        if (asset === "WETH") {
          fetchedOnce = true;
          setLoading(true);
          const price = await getAssetPriceInUSD(COINGECKO_CURRENCIES[asset]);
          setPrices({
            [asset]: price,
          });
          setLoading(false);
        } else {
          throw new Error(`Unknown asset ${asset}`);
        }
      })();
  }, [asset, setPrices]);

  return { price: prices[asset], loading };
};
export default useAssetPrice;
