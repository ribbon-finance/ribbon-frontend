import axios from "axios";
import { useCallback, useEffect } from "react";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { useGlobalState } from "../store/store";
import { GAS_URL } from "../utils/env";
import {
  isEthNetwork,
  isAuroraNetwork,
  isAvaxNetwork,
} from "../constants/constants";

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

    let gasPrice = "0";
    if (isEthNetwork(chainId)) {
      const response = await axios.get(GAS_URL[chainId]);
      const data: APIResponse = response.data;
      // If the result is undefined, we got rate limited - so return "0"
      gasPrice = data.result.FastGasPrice || "0";
    } else if (isAvaxNetwork(chainId)) {
      // Snowtrace API wrongly returns Ethereum mainnet gas price
      // But the good thing is that Avalanche hardcodes gas price to 25 nAVAX (gwei)
      gasPrice = "25";
    } else if (isAuroraNetwork(chainId)) {
      // And Aurora to 0 ETH for gas
      gasPrice = "0";
    }
    setGasPrice(parseUnits(gasPrice, "gwei").toString());
    fetchedOnce = true;
  }, [chainId, setGasPrice]);

  useEffect(() => {
    !fetchedOnce && fetchGasPrice();
  }, [fetchGasPrice]);

  return gasPrice;
};
export default useGasPrice;
