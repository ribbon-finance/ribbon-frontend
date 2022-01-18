import { useWeb3React as useWeb3ReactEthereum } from "@web3-react/core";
import { AbstractConnector } from "@web3-react/abstract-connector";
import {
  getWalletConnectConnector,
  injectedConnector,
  walletlinkConnector,
} from "shared/lib/utils/connectors";
import { providers } from "ethers";
import { useCallback } from "react";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { Chains, useChain } from "./chainContext";

interface Web3WalletData {
  chainId: number | undefined;
  active: boolean;
  activate: (wallet: Wallet) => Promise<void>;
  deactivate: () => Promise<void>;
  account: string | null | undefined;
  ethereumProvider: providers.Web3Provider | undefined;
}

enum EthereumWallet {
  Metamask = 1,
  WalletConnect = 2,
  WalletLink = 3,
}
const ETHEREUM_WALLETS = Object.values(EthereumWallet);

enum SolanaWallet {
  Phantom = 4,
  Solflare = 5,
}

type Wallet = EthereumWallet | SolanaWallet;

export const useWeb3Wallet = (): Web3WalletData => {
  const [chain] = useChain();

  const {
    chainId: chainIdEth,
    active: activeEth,
    activate: activateEth,
    account: accountEth,
    library: libraryEth,
    deactivate: deactivateEth,
    connector: connectorEth,
  } = useWeb3ReactEthereum();

  const activate = useCallback(
    async (wallet: Wallet) => {
      if (isEthereumWallet(wallet)) {
        const connector = ethereumConnectors[wallet as EthereumWallet]();
        await activateEth(connector);
      } else {
        throw new Error("Wallet not supported");
      }
    },
    [activateEth]
  );

  const deactivate = useCallback(async () => {
    if (connectorEth) {
      if (connectorEth instanceof WalletConnectConnector) {
        await connectorEth.close();
      }
      deactivateEth();
    }
  }, [connectorEth, deactivateEth]);

  if (chain === Chains.Solana) {
    return {
      chainId: 99999,
      active: false,
      account: undefined,
      ethereumProvider: undefined,
      activate: () => Promise.resolve(),
      deactivate: () => Promise.resolve(),
    };
  }

  return {
    chainId: chainIdEth,
    active: activeEth,
    activate,
    deactivate,
    account: accountEth,
    ethereumProvider: libraryEth,
  };
};

const ethereumConnectors: Record<EthereumWallet, () => AbstractConnector> = {
  [EthereumWallet.Metamask]: () => injectedConnector,
  [EthereumWallet.WalletConnect]: getWalletConnectConnector,
  [EthereumWallet.WalletLink]: () => walletlinkConnector,
};

const isEthereumWallet = (wallet: Wallet) =>
  ETHEREUM_WALLETS.includes(wallet as unknown as string);

export default useWeb3Wallet;
