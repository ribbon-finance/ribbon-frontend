import { createGlobalState } from "react-hooks-global-state";

import { DesktopViewType } from "../components/Product/types";
import { VaultOptions, VaultVersion } from "../constants/constants";
import { PendingTransaction, AirdropInfoData, CHAINS } from "./types";

interface GlobalStore {
  chain: CHAINS;

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
}

export const initialState: GlobalStore = {
  chain: CHAINS.NOT_SELECTED,
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
};

export const { useGlobalState } = createGlobalState(initialState);
