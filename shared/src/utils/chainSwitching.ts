import { providers } from "ethers";
import {
  AVALANCHE_MAINNET_PARAMS,
  AVALANCHE_TESTNET_PARAMS,
  AURORA_MAINNET_PARAMS,
  AURORA_TESTNET_PARAMS,
} from "../constants/chainParameters";
import { isAuroraNetwork, isAvaxNetwork } from "../constants/constants";
import { CHAINID } from "./env";

// This error code indicates that the chain has not been added to MetaMask.
const UNAVAILABLE_CHAIN_CODE = 4902;

/**
 * Function copied and modified from https://docs.metamask.io/guide/rpc-api.html#other-rpc-methods
 * error code 4902 refers to chain being available in the wallet
 */
export const switchChains = async (
  provider: providers.Web3Provider,
  chainId: number
) => {
  const hexChainId = "0x" + chainId.toString(16);

  if (!provider.provider.request) return;
  try {
    await provider.provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: hexChainId }],
    });
  } catch (switchError: any) {
    if (
      switchError.code === UNAVAILABLE_CHAIN_CODE ||
      (switchError.data &&
        switchError.data.originalError &&
        switchError.data.originalError.code === UNAVAILABLE_CHAIN_CODE)
    ) {
      let params: unknown;

      if (isAvaxNetwork(chainId)) {
        params =
          chainId === CHAINID.AVAX_MAINNET
            ? AVALANCHE_MAINNET_PARAMS
            : AVALANCHE_TESTNET_PARAMS;
      } else if (isAuroraNetwork(chainId)) {
        params =
          chainId === CHAINID.AURORA_MAINNET
            ? AURORA_MAINNET_PARAMS
            : AURORA_TESTNET_PARAMS;
      }

      if (params) {
        try {
          await provider.provider.request({
            method: "wallet_addEthereumChain",
            params: [params],
          });
        } catch (addError) {
          // handle "add" error
          console.error("Add network error");
        }
      } else {
        throw new Error("Network not found");
      }
    }
    // handle other "switch" errors
  }
};
