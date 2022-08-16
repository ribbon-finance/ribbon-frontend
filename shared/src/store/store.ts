import { createGlobalState } from "react-hooks-global-state";
import { DesktopViewType } from "../components/Product/types";
import { VaultOptions, VaultVersion } from "../constants/constants";
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
  vaultPauseModal: {
    show: boolean;
    vaultOption?: VaultOptions;
    vaultVersion: VaultVersion;
  };
  vaultResumeModal: {
    show: boolean;
    vaultOption?: VaultOptions;
    vaultVersion: VaultVersion;
  };
  showEarnVault: {
    show: boolean;
  };
  notificationLastReadTimestamp?: number;
  componentRefs: {
    header: HTMLDivElement | undefined;
    footer: HTMLDivElement | undefined;
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
    vaultVersion: "v2" as VaultVersion,
  },
  vaultPauseModal: {
    show: false,
    vaultVersion: "v2" as VaultVersion,
  },
  vaultResumeModal: {
    show: false,
    vaultVersion: "v2" as VaultVersion,
  },
  showEarnVault: {
    show: false,
  },
  notificationLastReadTimestamp: undefined,
  componentRefs: {
    header: undefined,
    footer: undefined,
  },
};

export const { useGlobalState } = createGlobalState(initialState);
