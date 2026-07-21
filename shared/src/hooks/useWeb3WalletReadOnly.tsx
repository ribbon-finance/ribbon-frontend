import { Web3Provider } from "@ethersproject/providers";
import { useWallet as useSolanaWallet } from "@solana/wallet-adapter-react";
import { useWeb3React as useEVMWallet } from "@web3-react/core";
import { Connector } from "@web3-react/types";
import { PublicKey } from "@solana/web3.js";
import { isLedgerDappBrowserProvider } from "web3-ledgerhq-frame-connector";

import { Chains } from "../constants/constants";
import { impersonateAddress } from "../utils/development";
import { useChain } from "./chainContext";

interface Web3WalletReadOnlyData {
  chainId: number | undefined;
  active: boolean;
  account: string | null | undefined;
  publicKey: PublicKey | undefined;
  ethereumProvider: Web3Provider | undefined;
  ethereumConnector?: Connector;
  solanaWallet: any;
  isLedgerLive: boolean;
}

export const useWeb3WalletReadOnly = (): Web3WalletReadOnlyData => {
  const [chain] = useChain();
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
    publicKey: publicKeySolana,
  } = useSolanaWallet();

  if (chain === Chains.Solana) {
    return {
      chainId: undefined,
      active: isActiveSolana,
      account: publicKeySolana && publicKeySolana.toString(),
      publicKey: publicKeySolana || undefined,
      ethereumProvider: undefined,
      ethereumConnector: undefined,
      solanaWallet: walletSolana || undefined,
      isLedgerLive: false,
    };
  }

  return {
    chainId: chainIdEth,
    active: isActiveEth,
    account: impersonateAddress ?? accountEth,
    publicKey: undefined,
    ethereumProvider: isActiveEth ? provider : undefined,
    ethereumConnector: connectorEth,
    solanaWallet: undefined,
    isLedgerLive: isLedgerDappBrowserProvider(),
  };
};

export default useWeb3WalletReadOnly;
