import { providers } from "ethers";
import { AVALANCHE_MAINNET_PARAMS } from "../constants/chainParameters";
import { CHAINID } from "../constants/constants";

export const switchChains = async (
  provider: providers.Web3Provider,
  chainId: number
) => {
  const hexChainId = "0x" + chainId.toString(16);

  try {
    await provider.provider.request!({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: hexChainId }],
    });
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      if (chainId === CHAINID.AVAX_MAINNET) {
        try {
          await provider.provider.request!({
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
