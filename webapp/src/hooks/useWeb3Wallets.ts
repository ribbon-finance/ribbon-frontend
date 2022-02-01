import { providers } from "ethers";
import {
  EthereumWallet,
  isEthereumWallet,
  isSolanaWallet,
  SolanaWallet,
  Wallet,
} from "../models/wallets";
import {
  Wallet as SolanaWalletInterface,
  WalletName,
} from "@solana/wallet-adapter-wallets";
import { Chains, useChain } from "./chainContext";
import { useCallback, useEffect, useState } from "react";
import { useWeb3React as useEVMWallet } from "@web3-react/core";
import { useWallet as useSolanaWallet } from "@solana/wallet-adapter-react";
import { AbstractConnector } from "@web3-react/abstract-connector";
import {
  getWalletConnectConnector,
  injectedConnector,
  walletlinkConnector,
} from "shared/lib/utils/connectors";
import { CHAINS_TO_ID } from "../constants/constants";
import { switchChains } from "shared/lib/utils/chainSwitching";
import { CHAINID } from "shared/lib/utils/env";
import { useChains } from "./chainContext2";

interface Data {
  chainId: number;
  account: string;
  isActive: boolean;

  activate: () => Promise<void>;
  deactivate: () => Promise<void>;
}

interface EVMWalletData extends Data {
  provider: providers.Web3Provider;
}

interface SolanaWalletData extends Data {
  wallet: SolanaWalletInterface;
}

type WalletTypes = EVMWalletData | SolanaWalletData;

interface Web3Data {
  wallets: Array<WalletTypes>;
  addNewChain: (wallet: Wallet, chain: Chains) => Promise<void>;
}

const evmConnectors: Record<EthereumWallet, () => AbstractConnector> = {
  [EthereumWallet.Metamask]: () => injectedConnector,
  [EthereumWallet.WalletConnect]: getWalletConnectConnector,
  [EthereumWallet.WalletLink]: () => walletlinkConnector,
};

export const useWeb3Data = (): Web3Data => {
  const {
    active: isActiveEth,
    activate: activateEth,
    deactivate: deactivateEth,
    account: accountEth,
    library: providerEth,
    chainId: chainIdEth,

    //   connector: connectorEth,
  } = useEVMWallet();

  const {
    connected: isActiveSolana,
    connect: activateSolana,
    disconnect: deactivateSolana,
    wallet: accountSolana,

    //   connecting: connectingSolana,
    //   publicKey: publicKeySolana,
    select: selectWalletSolana,
  } = useSolanaWallet();

  const [chain, setChain] = useChain();
  const [activeChainId, setActiveChainId] = useState<number>(chain);

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
  }, [isActiveEth, isActiveSolana, activeChainId]);

  // This useEffect triggers when there is a difference between selected chain and set chain in the ChainContext
  // - When there is a change between EVM chainIds
  // - We keep track of this using activeChainId, which is used as a comparison against the ChainContext
  useEffect(() => {
    const isEVMChain =
      activeChainId === Chains.Ethereum || activeChainId === Chains.Avalanche;

    // Check if the newly selected chainId is EVM
    if (isEVMChain && chain !== activeChainId && providerEth) {
      // If the new EVM chain is not the currently selected chainId in the context, trigger switchChains
      switchChains(providerEth, CHAINS_TO_ID[activeChainId]).then(() => {
        // Finally, set the chainContext to reference the updated chainId
        setChain(activeChainId);
      });
    }

    // If the newly selected chainId is EVM, always ensure that it is updated in the context
    if (isEVMChain) {
      setChain(activeChainId);
    }
  }, [chain, providerEth]);

  // Use this function to update the currently selected chain
  // This will automatically update the ChainContext as well
  const addNewChain = useCallback(
    async (wallet: Wallet, chain: Chains) => {
      console.log(wallet, chain);
      try {
        if (isEthereumWallet(wallet)) {
          setActiveChainId(chain);
          const connector = evmConnectors[wallet as EthereumWallet]();
          await activateEth(connector).then(() => {
            setTimeout(() => {
              if (providerEth && chain) {
                switchChains(providerEth, CHAINS_TO_ID[chain]).then(() => {
                  deactivateSolana();
                });
              }
            }, 100);
          });
        } else if (isSolanaWallet(wallet)) {
          console.log("Entering Solana");
          let walletName: WalletName = WalletName.Phantom;
          switch (wallet) {
            case SolanaWallet.Phantom:
              walletName = WalletName.Phantom;
              break;
            case SolanaWallet.Solflare:
              walletName = WalletName.Solflare;
              break;
          }

          console.log("Solana wallet", wallet, walletName);
          await deactivateEth();
          setTimeout(() => {
            selectWalletSolana(walletName);
            // activateSolana();
          }, 100);
        } else {
          throw new Error("Wallet is not supported");
        }
      } catch (error) {
        console.error(error);
      }
    },
    [activateEth, selectWalletSolana, providerEth]
  );

  return {
    addNewChain,
  } as Web3Data;
};
