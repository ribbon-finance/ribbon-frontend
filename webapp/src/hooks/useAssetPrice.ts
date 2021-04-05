import axios from "axios";
import { useEffect, useState } from "react";
import { useGlobalState } from "../store/store";

interface APIResponse {
  message: string;
  result: {
    ethbtc: string;
    ethbtc_timestamp: string;
    ethusd: string;
    ethusd_timestamp: string;
  };
}

const getETHPrice = async (): Promise<number> => {
  const API_KEY = process.env.REACT_APP_ETHERSCAN_API_KEY;
  const apiURL = `https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${API_KEY}`;

  const response = await axios.get(apiURL);
  const data: APIResponse = response.data;

  return parseFloat(data.result.ethusd);
};

type Assets = "WETH";

const useAssetPrice: (args: {
  asset?: Assets;
}) => { price: number; loading: boolean } = ({ asset = "WETH" }) => {
  const [prices, setPrices] = useGlobalState("prices");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (asset === "WETH") {
        setLoading(true);
        const price = await getETHPrice();
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
