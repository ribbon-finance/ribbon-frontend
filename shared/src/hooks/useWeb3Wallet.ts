import { useWeb3React as useWeb3ReactEthereum } from "@web3-react/core";
import { CHAINS } from "../store/types";
import { useSelectedChain } from "./useSelectedChain";

interface Web3Wallet {
  chainId: number | undefined;
  active: boolean;
  account: string | null | undefined;
  library: unknown;
}

const useWeb3Wallet = (): Web3Wallet => {
  const [chain] = useSelectedChain();

  const {
    chainId: chainIdEth,
    active: activeEth,
    account: accountEth,
    library: libraryEth,
  } = useWeb3ReactEthereum();

  if (chain === CHAINS.SOLANA) {
    return {
      chainId: 99999,
      active: false,
      account: undefined,
      library: undefined,
    };
  }

  return {
    chainId: chainIdEth,
    active: activeEth,
    account: accountEth,
    library: libraryEth,
  };
};

export default useWeb3Wallet;
