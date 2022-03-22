import { useWeb3React as useEVMWallet } from "@web3-react/core";
import { AbstractConnector } from "@web3-react/abstract-connector";
import {
  getWalletConnectConnector,
  injectedConnector,
  walletlinkConnector,
} from "../utils/connectors";
import { providers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { Wallet as SolanaWalletInterface } from "@solana/wallet-adapter-wallets";
import { useWallet as useSolanaWallet } from "@solana/wallet-adapter-react";
import { WalletName } from "@solana/wallet-adapter-wallets";
import { useChain } from "./chainContext";
import {
  EthereumWallet,
  isEthereumWallet,
  isSolanaWallet,
  SolanaWallet,
  Wallet,
} from "../models/wallets";
import { Chains, CHAINS_TO_ID, ID_TO_CHAINS } from "../constants/constants";
import { switchChains } from "../utils/chainSwitching";

interface Web3WalletData {
  chainId: number | undefined;
  active: boolean;
  activate: (wallet: Wallet, chain: Chains) => Promise<void>;
  deactivate: () => Promise<void>;
  account: string | null | undefined;
  connectingWallet: Wallet | undefined;
  connectedWallet: Wallet | undefined;
  ethereumProvider: providers.Web3Provider | undefined;
  solanaWallet: SolanaWalletInterface | undefined;
}

export const useWeb3Wallet = (): Web3WalletData => {
  const [chain, setChain] = useChain();
  const [chainToSwitch, setChainToSwitch] = useState<Chains | null>(null);
  const [connectingWallet, setConnectingWallet] = useState<Wallet>();
  const [connectedWallet, setConnectedWallet] = useState<Wallet>();

  const {
    chainId: chainIdEth,
    active: isActiveEth,
    activate: activateEth,
    account: accountEth,
    library: libraryEth,
    deactivate: _deactivateEth,
    connector: connectorEth,
  } = useEVMWallet();

  const {
    wallet: walletSolana,
    connected: isActiveSolana,
    disconnect: deactivateSolana,
    publicKey: publicKeySolana,
    select: selectWalletSolana,
  } = useSolanaWallet();

  // This hook manages the entire multi-chain flow
  // It checks when an active provider is available and sets the global chainContext accordingly
  useEffect(() => {
    if (isActiveEth && chainIdEth) {
      setChain(ID_TO_CHAINS[chainIdEth as number]);
    } else if (isActiveSolana && !chainIdEth) {
      setChain(Chains.Solana);
    }
  }, [chainIdEth, isActiveEth, isActiveSolana, setChain]);

  // This hook checks if there is an EVM chainId to switch to
  // If so, it will prompt switchChains only when a provider is available
  useEffect(() => {
    const onSwitchChains = async () => {
      await switchChains(libraryEth, CHAINS_TO_ID[chainToSwitch as Chains]);
      setChainToSwitch(null);
    };

    if (chainToSwitch && libraryEth) {
      onSwitchChains();
    }
  }, [libraryEth, chainToSwitch]);

  const deactivateEth = useCallback(async () => {
    if (connectorEth) {
      if (connectorEth instanceof WalletConnectConnector) {
        await connectorEth.close();
      }

      _deactivateEth();
      setConnectedWallet(undefined);
    }
  }, [connectorEth, _deactivateEth]);

  const activate = useCallback(
    async (wallet: Wallet, chain: Chains) => {
      setConnectingWallet(wallet);

      try {
        if (isEthereumWallet(wallet)) {
          if (!isActiveEth) {
            const connector = evmConnectors[wallet as EthereumWallet]();
            await activateEth(connector);
          }

          await deactivateSolana();
          setChainToSwitch(chain);
          setConnectedWallet(wallet as EthereumWallet);
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

          await deactivateEth();
          selectWalletSolana(walletName);
        } else {
          throw new Error("Wallet is not supported");
        }

        setConnectedWallet(wallet as SolanaWallet);
        setConnectingWallet(undefined);
      } catch (error) {
        console.error(error); // eslint-disable-line
      }
    },
    [
      activateEth,
      deactivateEth,
      deactivateSolana,
      isActiveEth,
      selectWalletSolana,
    ]
  );

  if (chain === Chains.Solana) {
    return {
      chainId: undefined,
      active: isActiveSolana,
      account: publicKeySolana && publicKeySolana.toString(),
      activate,
      deactivate: deactivateSolana,
      connectingWallet,
      connectedWallet,
      ethereumProvider: undefined,
      solanaWallet: walletSolana || undefined,
    };
  }

  return {
    chainId: chainIdEth,
    active: isActiveEth,
    activate,
    deactivate: deactivateEth,
    account: accountEth,
    connectingWallet,
    connectedWallet,
    ethereumProvider: libraryEth,
    solanaWallet: undefined,
  };
};

const evmConnectors: Record<EthereumWallet, () => AbstractConnector> = {
  [EthereumWallet.Metamask]: () => injectedConnector,
  [EthereumWallet.WalletConnect]: getWalletConnectConnector,
  [EthereumWallet.WalletLink]: () => walletlinkConnector,
};

export default useWeb3Wallet;
