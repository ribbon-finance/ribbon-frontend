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

    // Snowtrace API wrongly returns Ethereum mainnet gas price
    // But the good thing is that Avalanche hardcodes gas price to 25 nAVAX (gwei)
    if (chainId === CHAINID.AVAX_MAINNET) {
      fetchedOnce = true;
      setGasPrice(parseUnits("25", "gwei").toString());
      return;
    }

    const response = await axios.get(GAS_URL[chainId]);
    const data: APIResponse = response.data;

    fetchedOnce = true;
    setGasPrice(parseUnits(data.result.FastGasPrice, "gwei").toString());
  }, [chainId, setGasPrice]);

  useEffect(() => {
    !fetchedOnce && fetchGasPrice();
  }, [fetchGasPrice]);

  return gasPrice;
};
export default useGasPrice;
