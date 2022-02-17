import { createGlobalState } from "react-hooks-global-state";

import { DesktopViewType } from "../components/Product/types";
import { VaultOptions, VaultVersion } from "../constants/constants";
import { EthereumWallet, SolanaWallet } from "../models/wallets";
import { PendingTransaction, AirdropInfoData } from "./types";

interface GlobalStore {
  pendingTransactions: PendingTransaction[];
  showConnectWallet: boolean;

  gasPrice: string;
  desktopView: DesktopViewType;
  airdropInfo: AirdropInfoData | undefined;
  vaultPositionModal: {
    show: boolean;
    vaultOption?: VaultOptions;
    vaultVersion: VaultVersion;
  };
  notificationLastReadTimestamp?: number;
  wallet: {
    connectedWallet?: EthereumWallet | SolanaWallet;
    connectingWallet?: EthereumWallet | SolanaWallet;
  };
}

export const initialState: GlobalStore = {
  pendingTransactions: [],
  showConnectWallet: false,
  gasPrice: "",
  desktopView: "grid",
  airdropInfo: undefined,
  vaultPositionModal: {
    show: false,
    vaultVersion: "v1" as VaultVersion,
  },
  notificationLastReadTimestamp: undefined,
  wallet: {
    connectedWallet: undefined,
    connectingWallet: undefined,
  },
};

export const { useGlobalState } = createGlobalState(initialState);
