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
import { useChain } from "./chainContext";
import {
  EthereumWallet,
  isEthereumWallet,
  Wallet,
} from "shared/lib/models/wallets";
import { Chains, CHAINS_TO_ID, ID_TO_CHAINS } from "../constants/constants";
import { switchChains } from "shared/lib/utils/chainSwitching";
import { impersonateAddress } from "shared/lib/utils/development";
import { isLedgerDappBrowserProvider } from "web3-ledgerhq-frame-connector";

interface Web3WalletData {
  chainId: number | undefined;
  active: boolean;
  activate: (wallet: Wallet, chain: Chains) => Promise<void>;
  deactivate: () => Promise<void>;
  account: string | null | undefined;
  connectingWallet: Wallet | undefined;
  connectedWallet: Wallet | undefined;
  ethereumProvider: providers.Web3Provider | undefined;
  ethereumConnector?: AbstractConnector;
  // True if is embeded in ledger live
  isLedgerLive: boolean;
}

export const useWeb3Wallet = (): Web3WalletData => {
  const [, setChain] = useChain();
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

  // This hook manages the entire multi-chain flow
  // It checks when an active provider is available and sets the global chainContext accordingly
  useEffect(() => {
    if (isActiveEth && chainIdEth) {
      setChain(ID_TO_CHAINS[chainIdEth as number]);
    } else if (!chainIdEth) {
      setChain(Chains.NotSelected);
    }
  }, [chainIdEth, isActiveEth, setChain]);

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

          setChainToSwitch(chain);
          setConnectedWallet(wallet as EthereumWallet);
        } else {
          throw new Error("Wallet is not supported");
        }

        setConnectedWallet(wallet as EthereumWallet);
        setConnectingWallet(undefined);
      } catch (error) {
        console.error(error); // eslint-disable-line
      }
    },
    [activateEth, isActiveEth]
  );

  return {
    chainId: chainIdEth,
    active: isActiveEth,
    activate,
    deactivate: deactivateEth,
    account: impersonateAddress ?? accountEth,
    connectingWallet,
    connectedWallet,
    ethereumProvider: libraryEth,
    ethereumConnector: connectorEth,
    isLedgerLive: isLedgerDappBrowserProvider(),
  };
};

const evmConnectors: Record<EthereumWallet, () => AbstractConnector> = {
  [EthereumWallet.Metamask]: () => injectedConnector,
  [EthereumWallet.WalletConnect]: getWalletConnectConnector,
  [EthereumWallet.WalletLink]: () => walletlinkConnector,
};

export default useWeb3Wallet;
