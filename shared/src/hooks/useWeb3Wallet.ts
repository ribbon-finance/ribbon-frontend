import { useWeb3React as useWeb3ReactEthereum } from "@web3-react/core";
import { isSolana } from "../utils/env";

interface Web3Wallet {
  chainId: number | undefined;
  active: boolean;
  account: string | null | undefined;
  library: unknown;
}

const useWeb3Wallet = (): Web3Wallet => {
  const {
    chainId: chainIdEth,
    active: activeEth,
    account: accountEth,
    library: libraryEth,
  } = useWeb3ReactEthereum();

  if (!isSolana()) {
    return {
      chainId: chainIdEth,
      active: activeEth,
      account: accountEth,
      library: libraryEth,
    };
  }
  return {
    chainId: 99999,
    active: false,
    account: undefined,
    library: undefined,
  };
};

export default useWeb3Wallet;
