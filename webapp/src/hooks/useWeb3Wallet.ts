import { useWeb3React as useWeb3ReactEthereum } from "@web3-react/core";
import { AbstractConnector } from "@web3-react/abstract-connector";
import {
  getWalletConnectConnector,
  injectedConnector,
  walletlinkConnector,
} from "shared/lib/utils/connectors";
import { providers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { useWallet as useSolanaWallet } from "@solana/wallet-adapter-react";
import { WalletName } from "@solana/wallet-adapter-wallets";
import { Chains, useChain } from "./chainContext";
import {
  EthereumWallet,
  isEthereumWallet,
  isSolanaWallet,
  SolanaWallet,
  Wallet,
} from "../models/wallets";

interface Web3WalletData {
  chainId: number | undefined;
  active: boolean;
  activate: (wallet: Wallet) => Promise<void>;
  deactivate: () => Promise<void>;
  account: string | null | undefined;
  ethereumProvider: providers.Web3Provider | undefined;
  connectingWallet: Wallet | undefined;
  connectedWallet: Wallet | undefined;
}

export const useWeb3Wallet = (): Web3WalletData => {
  const [chain] = useChain();

  const [connectingWallet, setConnectingWallet] = useState<Wallet>();
  const [connectedWallet, setConnectedWallet] = useState<Wallet>();

  const {
    chainId: chainIdEth,
    active: activeEth,
    activate: activateEth,
    account: accountEth,
    library: libraryEth,
    deactivate: deactivateEth,
    connector: connectorEth,
  } = useWeb3ReactEthereum();

  const {
    wallet: walletSolana,
    connected: connectedSolana,
    connect: connectSolana,
    connecting: connectingSolana,
    publicKey: account,
    select: selectWalletSolana,
  } = useSolanaWallet();

  const activate = useCallback(
    async (wallet: Wallet) => {
      if (isEthereumWallet(wallet)) {
        const connector = ethereumConnectors[wallet as EthereumWallet]();
        setConnectingWallet(wallet);
        try {
          await activateEth(connector);
          setConnectingWallet(undefined);
          setConnectedWallet(wallet);
        } catch (e) {
          setConnectedWallet(undefined);
        }
      } else if (isSolanaWallet(wallet)) {
        let walletName: WalletName = WalletName.Phantom;
        switch (wallet) {
          case SolanaWallet.Phantom:
            walletName = WalletName.Phantom;
            break;
          case SolanaWallet.Solflare:
            walletName = WalletName.Solflare;
            break;
        }

        selectWalletSolana(walletName);
        setConnectingWallet(wallet);
      } else {
        throw new Error("Wallet not supported");
      }
    },
    [activateEth]
  );

  // This is specifically needed for solana
  // because you need to implicitly call connect() after you detect a connecting state
  useEffect(() => {
    if (connectingWallet && isSolanaWallet(connectingWallet)) {
      (async () => {
        try {
          await connectSolana();
          setConnectingWallet(undefined);
          setConnectedWallet(connectingWallet);
        } catch (e) {
          setConnectingWallet(undefined);
        }
      })();
    }
  }, [connectingWallet, connectSolana]);

  const deactivate = useCallback(async () => {
    if (connectorEth) {
      if (connectorEth instanceof WalletConnectConnector) {
        await connectorEth.close();
      }
      deactivateEth();
      setConnectedWallet(undefined);
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
      connectingWallet,
      connectedWallet,
    };
  }

  return {
    chainId: chainIdEth,
    active: activeEth,
    activate,
    deactivate,
    account: accountEth,
    ethereumProvider: libraryEth,
    connectingWallet,
    connectedWallet,
  };
};

const ethereumConnectors: Record<EthereumWallet, () => AbstractConnector> = {
  [EthereumWallet.Metamask]: () => injectedConnector,
  [EthereumWallet.WalletConnect]: getWalletConnectConnector,
  [EthereumWallet.WalletLink]: () => walletlinkConnector,
};

export default useWeb3Wallet;
