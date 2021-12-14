import { providers } from "ethers";
import { AVALANCHE_MAINNET_PARAMS } from "../constants/chainParameters";
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
    if (switchError.code === UNAVAILABLE_CHAIN_CODE) {
      if (chainId === CHAINID.AVAX_MAINNET) {
        try {
          await provider.provider.request({
            method: "wallet_addEthereumChain",
            params: [AVALANCHE_MAINNET_PARAMS],
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
