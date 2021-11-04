import { createGlobalState } from "react-hooks-global-state";

import { DesktopViewType } from "../components/Product/types";
import { VaultOptions, VaultVersion } from "../constants/constants";
import {
  DefiScoreProtocol,
  DefiScoreToken,
  DefiScoreTokenList,
} from "../models/defiScore";
import {
  PendingTransaction,
  AssetYieldsInfoData,
  AirdropInfoData,
} from "./types";

interface GlobalStore {
  pendingTransactions: PendingTransaction[];
  showConnectWallet: boolean;
  assetYieldsInfo: {
    fetched: boolean;
    data: AssetYieldsInfoData;
  };
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
  pendingTransactions: [],
  showConnectWallet: false,
  assetYieldsInfo: {
    fetched: false,
    data: Object.fromEntries(
      DefiScoreTokenList.map((token) => [token, new Array(0)])
    ) as {
      [token in DefiScoreToken]: Array<{
        protocol: DefiScoreProtocol;
        apr: number;
      }>;
    },
  },
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
