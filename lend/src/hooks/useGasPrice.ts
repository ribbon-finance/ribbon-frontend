import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";

const { parseUnits } = ethers.utils;

interface APIResponse {
  message: string;
  result: {
    LastBlock: string;
    SafeGasPrice: string;
    ProposeGasPrice: string;
    FastGasPrice: string;
  };
}

interface GasPrices {
  fetched: boolean;
  safe: BigNumber;
  fast: BigNumber;
}

const useGasPrice = () => {
  const API_KEY = process.env.REACT_APP_ETHERSCAN_API_KEY;
  const API_URL = `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${API_KEY}`;

  const [gasPrice, setGasPrice] = useState<GasPrices>({
    fetched: false,
    safe: BigNumber.from("0"),
    fast: BigNumber.from("0"),
  });

  const fetchGasPrice = useCallback(async () => {
    const response = await axios.get(API_URL);
    const data: APIResponse = response.data;

    setGasPrice({
      fetched: true,
      safe: parseUnits(data.result.SafeGasPrice, "gwei"),
      fast: parseUnits(data.result.FastGasPrice, "gwei"),
    });
  }, [API_URL]);

  useEffect(() => {
    fetchGasPrice();
  }, [fetchGasPrice]);
  return gasPrice;
};
export default useGasPrice;
