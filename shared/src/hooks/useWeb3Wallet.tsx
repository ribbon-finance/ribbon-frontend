import { useWeb3React as useEVMWallet } from "@web3-react/core";
import { Connector } from "@web3-react/types";
import { Web3Provider } from "@ethersproject/providers";
import { useCallback, useEffect, useState } from "react";
import { WalletConnect as WalletConnectV2 } from "@web3-react/walletconnect-v2";
import { useWallet as useSolanaWallet } from "@solana/wallet-adapter-react";
import {
  PhantomWalletName,
  SolflareWalletName,
} from "@solana/wallet-adapter-wallets";
import { WalletName } from "@solana/wallet-adapter-base";
import { useChain } from "./chainContext";
import { isSolanaWallet, SolanaWallet, Wallet } from "../models/wallets";
import { Chains, ChainsToCHAINID, ID_TO_CHAINS } from "../constants/constants";
import { impersonateAddress } from "../utils/development";
import { isLedgerDappBrowserProvider } from "web3-ledgerhq-frame-connector";
import { PublicKey } from "@solana/web3.js";
import {
  LAST_CONNECTED_WALLET_LOCAL_STORAGE_KEY,
  allConnectors,
  walletToConnector,
} from "../utils/wallet/connectors";

interface Web3WalletData {
  chainId: number | undefined;
  active: boolean;
  activate: (wallet: Wallet, chain: Chains) => Promise<void>;
  deactivate: () => Promise<void>;
  account: string | null | undefined;
  publicKey: PublicKey | undefined;
  connectingWallet: Wallet | undefined;
  connectedWallet: Wallet | undefined;
  ethereumProvider: Web3Provider | undefined;
  ethereumConnector?: Connector;
  solanaWallet: any;
  // True if is embeded in ledger live
  isLedgerLive: boolean;
}

// This error code indicates that
export enum ChainCodeErrorEnum {
  UNAVAILABLE = 4902, // chain has not been added to MetaMask
  CANCELLED = 4001, // switching chain has been cancelled
}

export const useWeb3Wallet = (): Web3WalletData => {
  const [chain, setChain] = useChain();
  const [chainToSwitch, setChainToSwitch] = useState<Chains | null>(null);
  const [connectingWallet, setConnectingWallet] = useState<Wallet>();
  const [connectedWallet, setConnectedWallet] = useState<Wallet>();

  const {
    chainId: chainIdEth,
    isActive: isActiveEth,
    account: accountEth,
    connector: connectorEth,
    provider,
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
    const onSwitchChains = async (id: number) => {
      try {
        if (id === -1) {
          await connectorEth.activate();
        } else {
          await connectorEth.activate(id);
        }
      } catch (switchError: any) {
        if (switchError.code === ChainCodeErrorEnum.CANCELLED) {
          window.location.reload();
        }
      }
      setChainToSwitch(null);
    };

    if (chainToSwitch && chainToSwitch !== chainIdEth && connectorEth) {
      onSwitchChains(chainToSwitch);
    }
  }, [chainIdEth, chainToSwitch, connectorEth]);

  const deactivateEth = useCallback(async () => {
    try {
      // Deactivate all connectors
      const promises = allConnectors.map(async (c) => {
        const connector = c[0];
        await connector.deactivate?.();
        await connector.resetState();
      });
      await Promise.all(promises);
      // Remove last connected wallet from local storage so we don't eagerly connect to anything
      localStorage.removeItem(LAST_CONNECTED_WALLET_LOCAL_STORAGE_KEY);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("Error deactivating", error);
    }
  }, []);

  const activate = useCallback(
    async (wallet: Wallet, chainId: Chains) => {
      setConnectingWallet(wallet);
      try {
        if (isSolanaWallet(wallet)) {
          let walletName: WalletName = PhantomWalletName;
          switch (wallet) {
            case SolanaWallet.Phantom:
              walletName = PhantomWalletName;
              break;
            case SolanaWallet.Solflare:
              walletName = SolflareWalletName;
              break;
          }

          await deactivateEth();
          selectWalletSolana(walletName);
        } else {
          // Connect to the selected connector
          const connector = walletToConnector[wallet as Wallet]();
          // If is wallet connect, we try to connect eagerly first
          // This is because activate() will do nothing if it
          // already has an active session
          if (connector instanceof WalletConnectV2) {
            // If theres an error here, we ignore and try to activate()
            await connector?.connectEagerly().catch(() => {});
          }
          await connector?.activate(ChainsToCHAINID[chainId]);
          await deactivateSolana();
          setChainToSwitch(chain);
          setConnectedWallet(wallet as Wallet);
          // Update local storage so we know which wallet to connect to when we connect eagerly
          localStorage.setItem(
            LAST_CONNECTED_WALLET_LOCAL_STORAGE_KEY,
            String(wallet)
          );
        }
        setConnectingWallet(undefined);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    [chain, deactivateEth, deactivateSolana, selectWalletSolana]
  );

  if (chain === Chains.Solana) {
    return {
      chainId: undefined,
      active: isActiveSolana,
      account: publicKeySolana && publicKeySolana.toString(),
      publicKey: publicKeySolana || undefined,
      activate,
      deactivate: deactivateSolana,
      connectingWallet,
      connectedWallet,
      ethereumProvider: undefined,
      ethereumConnector: undefined,
      solanaWallet: walletSolana || undefined,
      isLedgerLive: false,
    };
  }

  return {
    chainId: chainIdEth,
    active: isActiveEth,
    activate,
    deactivate: deactivateEth,
    account: impersonateAddress ?? accountEth,
    publicKey: undefined,
    connectingWallet,
    connectedWallet,
    ethereumProvider: isActiveEth ? provider : undefined,
    ethereumConnector: connectorEth,
    solanaWallet: undefined,
    isLedgerLive: isLedgerDappBrowserProvider(),
  };
};

export default useWeb3Wallet;
