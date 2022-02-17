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
import { useGlobalState } from "../store/store";

interface Web3WalletData {
  chainId: number | undefined;
  active: boolean;
  activate: (chain: Chains) => Promise<void>;
  deactivate: () => Promise<void>;
  account: string | null | undefined;
  ethereumProvider: providers.Web3Provider | undefined;
  solanaWallet: SolanaWalletInterface | undefined;
}

export const useWeb3Wallet = (): Web3WalletData => {
  const [chain, setChain] = useChain();
  const [chainToSwitch, setChainToSwitch] = useState<Chains | null>(null);
  const [globalWallet, setWallet] = useGlobalState("wallet");

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
    }
  }, [connectorEth, _deactivateEth]);

  const activate = useCallback(
    async (newChain: Chains) => {
      if (isEthereumWallet(globalWallet.connectingWallet as EthereumWallet)) {
        const connector =
          evmConnectors[globalWallet.connectingWallet as EthereumWallet]();

        setWallet({
          connectingWallet: undefined,
          connectedWallet: globalWallet.connectingWallet,
        });

        try {
          await activateEth(connector);
          deactivateSolana();
          setChainToSwitch(newChain);
        } catch (error) {
          console.error(error);
        }
      } else if (
        isSolanaWallet(globalWallet.connectingWallet as SolanaWallet)
      ) {
        let walletName: WalletName = WalletName.Phantom;
        switch (globalWallet.connectingWallet) {
          case SolanaWallet.Phantom:
            walletName = WalletName.Phantom;
            break;
          case SolanaWallet.Solflare:
            walletName = WalletName.Solflare;
            break;
        }

        setWallet({
          connectingWallet: undefined,
          connectedWallet: globalWallet.connectingWallet,
        });

        try {
          await deactivateEth();
          selectWalletSolana(walletName);
        } catch (error) {
          console.error(error);
        }
      } else {
        throw new Error("Wallet is not supported");
      }
    },
    [
      activateEth,
      deactivateEth,
      deactivateSolana,
      selectWalletSolana,
      setWallet,
      globalWallet,
      isActiveEth,
    ]
  );

  if (chain === Chains.Solana) {
    return {
      chainId: undefined,
      active: isActiveSolana,
      account: publicKeySolana && publicKeySolana.toString(),
      activate,
      deactivate: deactivateSolana,
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
