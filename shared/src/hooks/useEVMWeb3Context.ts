import { CHAINID, isDevelopment } from "../utils/env";
import { useWeb3Context } from "./web3Context";
import { MAINNET_NAMES } from "../constants/constants";

export const useEVMWeb3Context = () => {
  const providers = {
    mainnet: useWeb3Context(
      isDevelopment() ? CHAINID.ETH_KOVAN : CHAINID.ETH_MAINNET
    ).provider,
    avax: useWeb3Context(
      isDevelopment() ? CHAINID.AVAX_FUJI : CHAINID.AVAX_MAINNET
    ).provider,
    aurora: useWeb3Context(CHAINID.AURORA_MAINNET).provider,
  };

  const getProviderForNetwork = (network: MAINNET_NAMES) => providers[network];

  return {
    getProviderForNetwork,
  };
};
