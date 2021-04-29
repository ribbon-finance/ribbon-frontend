import axios from "axios";
import { useCallback, useEffect } from "react";
import { ethers } from "ethers";
import { useGlobalState } from "shared/lib/store/store";

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

let fetchedOnce = false;

const useGasPrice = () => {
  const API_KEY = process.env.REACT_APP_ETHERSCAN_API_KEY;
  const API_URL = `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${API_KEY}`;

  const [gasPrice, setGasPrice] = useGlobalState("gasPrice");

  const fetchGasPrice = useCallback(async () => {
    fetchedOnce = true;
    const response = await axios.get(API_URL);
    const data: APIResponse = response.data;

    setGasPrice(parseUnits(data.result.FastGasPrice, "gwei").toString());
  }, [API_URL, setGasPrice]);

  useEffect(() => {
    !fetchedOnce && fetchGasPrice();
  }, [fetchGasPrice]);

  return gasPrice;
};
export default useGasPrice;
