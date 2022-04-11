import { providers } from "ethers";
import {
  AVALANCHE_MAINNET_PARAMS,
  AVALANCHE_TESTNET_PARAMS,
} from "../constants/chainParameters";
import { isAvaxNetwork } from "../constants/constants";
import { CHAINID } from "./env";

// This error code indicates that
enum ChainCodeErrorEnum {
  UNAVAILABLE = 4902, // chain has not been added to MetaMask
  CANCELLED = 4001, // switching chain has been cancelled
}

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
    if (switchError.code === ChainCodeErrorEnum.CANCELLED) {
      window.location.reload();
    }

    if (
      switchError.code === ChainCodeErrorEnum.UNAVAILABLE ||
      (switchError.data &&
        switchError.data.originalError &&
        switchError.data.originalError.code === ChainCodeErrorEnum.UNAVAILABLE)
    ) {
      let params: unknown;

      if (isAvaxNetwork(chainId)) {
        params =
          chainId === CHAINID.AVAX_MAINNET
            ? AVALANCHE_MAINNET_PARAMS
            : AVALANCHE_TESTNET_PARAMS;
      }

      if (params) {
        try {
          await provider.provider.request({
            method: "wallet_addEthereumChain",
            params: [params],
          });
        } catch (addError) {
          // handle "add" error
          console.error("Add network error"); // eslint-disable-line
        }
      } else {
        throw new Error("Network not found");
      }
    }
  }
};
