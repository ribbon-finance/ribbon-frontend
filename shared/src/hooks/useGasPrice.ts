import axios from "axios";
import { useCallback, useEffect } from "react";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { useGlobalState } from "../store/store";
import { CHAINID, GAS_URL } from "../utils/env";

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

// GLobal state
let fetchedOnce = false;

const useGasPrice = () => {
  const { chainId } = useWeb3React();
  const [gasPrice, setGasPrice] = useGlobalState("gasPrice");

  const fetchGasPrice = useCallback(async () => {
    if (!chainId) return;

    fetchedOnce = true;
    const response = await axios.get(GAS_URL[chainId]);
    const data: APIResponse = response.data;

    setGasPrice(parseUnits(data.result.FastGasPrice, "gwei").toString());
  }, [chainId, setGasPrice]);

  useEffect(() => {
    !fetchedOnce && fetchGasPrice();
  }, [fetchGasPrice]);

  return gasPrice;
};
export default useGasPrice;
