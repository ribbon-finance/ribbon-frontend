import { useWeb3React as useEVMWallet } from "@web3-react/core";
import { AbstractConnector } from "@web3-react/abstract-connector";
import {
  getWalletConnectConnector,
  injectedConnector,
  walletlinkConnector,
} from "shared/lib/utils/connectors";
import { providers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { Wallet as SolanaWalletInterface } from "@solana/wallet-adapter-wallets";
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
import { CHAINID } from "shared/lib/utils/env";
import { CHAINS_TO_ID } from "../constants/constants";
import { switchChains } from "shared/lib/utils/chainSwitching";

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

  const [connectingWallet, setConnectingWallet] = useState<Wallet>();
  const [connectedWallet, setConnectedWallet] = useState<Wallet>();
  const [activeChainId, setActiveChainId] = useState<number>(chain);

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
    connect: connectSolana,
    disconnect: deactivateSolana,
    connecting: connectingSolana,
    publicKey: publicKeySolana,
    select: selectWalletSolana,
  } = useSolanaWallet();

  // This useEffect triggers when there is an attempt to connect a new wallet
  useEffect(() => {
    if (isActiveSolana) {
      // When connecting to a Solana wallet
      setChain(Chains.Solana);
    }

    if (isActiveEth) {
      // When connecting to an EVM wallet
      if (activeChainId === CHAINS_TO_ID[Chains.Ethereum]) {
        setChain(activeChainId);
      } else if (activeChainId === CHAINS_TO_ID[Chains.Avalanche]) {
        setChain(activeChainId);
      }
    }
  }, [isActiveEth, isActiveSolana, activeChainId, setChain]);

  // This useEffect triggers when there is a difference between selected chain and set chain in the ChainContext
  // - When there is a change between EVM chainIds
  // - We keep track of this using activeChainId, which is used as a comparison against the ChainContext
  useEffect(() => {
    const isEVMChain =
      activeChainId === Chains.Ethereum || activeChainId === Chains.Avalanche;

    // Check if the newly selected chainId is EVM
    if (isEVMChain && chain !== activeChainId && libraryEth) {
      // If the new EVM chain is not the currently selected chainId in the context, trigger switchChains
      switchChains(libraryEth, CHAINS_TO_ID[activeChainId]).then(() => {
        // Finally, set the chainContext to reference the updated chainId
        setChain(activeChainId);
      });
    }

    // If the newly selected chainId is EVM, always ensure that it is updated in the context
    if (isEVMChain) {
      setChain(activeChainId);
    }
  }, [chain, libraryEth, activeChainId, setChain]);

  // Use this function to update the currently selected chain
  // This will automatically update the ChainContext as well
  const activate = useCallback(
    async (wallet: Wallet, chain: Chains) => {
      try {
        if (isEthereumWallet(wallet)) {
          setActiveChainId(chain);
          const connector = evmConnectors[wallet as EthereumWallet]();
          await activateEth(connector).then(() => {
            setTimeout(() => {
              if (libraryEth && chain) {
                switchChains(libraryEth, CHAINS_TO_ID[chain]).then(() => {
                  deactivateSolana();
                });
              }
            }, 100);
          });
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

          await _deactivateEth();
          setTimeout(() => {
            selectWalletSolana(walletName);
          }, 100);
        } else {
          throw new Error("Wallet is not supported");
        }
      } catch (error) {
        console.error(error);
      }
    },
    [
      libraryEth,
      activateEth,
      selectWalletSolana,
      _deactivateEth,
      deactivateSolana,
    ]
  );

  // Chain switching effects
  // `chain` is a completely different state from the chainId set by the wallet
  // so we need to refresh it
  useEffect(() => {
    switch (chainIdEth) {
      case CHAINID.ETH_KOVAN:
      case CHAINID.ETH_MAINNET:
        setChain(Chains.Ethereum);
        break;
      case CHAINID.AVAX_FUJI:
      case CHAINID.AVAX_MAINNET:
        setChain(Chains.Avalanche);
        break;
      default:
        break;
    }
  }, [chainIdEth, setChain]);

  // Auto-connecting solana wallets
  useEffect(() => {
    // If somehow we are already connected to Ethereum,
    // we don't change the chain to Solana
    if (isActiveSolana && !chainIdEth && walletSolana) {
      setChain(Chains.Solana);
      setConnectedWallet(getSolanaWallet(walletSolana.name));
    }
  }, [isActiveSolana, setChain, chainIdEth, walletSolana, setConnectedWallet]);

  // This is specifically needed for solana
  // because you need to implicitly call connect() after you detect a connecting state
  useEffect(() => {
    if (
      !connectingSolana &&
      connectingWallet &&
      isSolanaWallet(connectingWallet)
    ) {
      (async () => {
        try {
          await connectSolana();
          setConnectingWallet(undefined);
          setConnectedWallet(connectingWallet);
        } catch (e: unknown) {
          const error: { name: string } = e as { name: string };
          if (error.name === "WalletConnectionError") {
            setConnectingWallet(undefined);
          }
        }
      })();
    }
  }, [connectingWallet, connectingSolana, connectSolana]);

  // setting connected state for eth wallet
  useEffect(() => {
    if (
      connectingWallet &&
      isEthereumWallet(connectingWallet) &&
      accountEth &&
      isActiveEth
    ) {
      setConnectedWallet(connectingWallet);
    }
  }, [accountEth, isActiveEth, connectingWallet]);

  const deactivateEth = useCallback(async () => {
    if (connectorEth) {
      if (connectorEth instanceof WalletConnectConnector) {
        await connectorEth.close();
      }
      _deactivateEth();
      setConnectedWallet(undefined);
    }
  }, [connectorEth, _deactivateEth]);

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

const getSolanaWallet: (walletName: WalletName) => Wallet = (
  walletName = WalletName.Phantom
) => {
  switch (walletName) {
    case WalletName.Phantom:
      return SolanaWallet.Phantom as Wallet;
    case WalletName.Solflare:
      return SolanaWallet.Solflare as Wallet;
    default:
      return SolanaWallet.Phantom as Wallet;
  }
};

export default useWeb3Wallet;
