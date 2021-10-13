import { createGlobalState } from "react-hooks-global-state";

import { DesktopViewType } from "../components/Product/types";
import {
  VaultList,
  VaultOptions,
  VaultVersion,
  VaultVersionList,
} from "../constants/constants";
import {
  DefiScoreProtocol,
  DefiScoreToken,
  DefiScoreTokenList,
} from "../models/defiScore";
import {
  PendingTransaction,
  Assets,
  AssetsList,
  AssetYieldsInfoData,
  AirdropInfoData,
} from "./types";

interface GlobalStore {
  prices: { [asset in Assets]: { price: number; fetched: boolean } };
  pendingTransactions: PendingTransaction[];
  showConnectWallet: boolean;
  latestAPY: {
    [option in VaultOptions]: {
      apy: number;
      fetched: boolean;
    };
  };
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
  prices: Object.fromEntries(
    AssetsList.map((asset) => [asset, { price: 0.0, fetched: false }])
  ) as {
    [asset in Assets]: { price: number; fetched: boolean };
  },
  pendingTransactions: [],
  showConnectWallet: false,
  latestAPY: Object.fromEntries(
    VaultList.map((option) => [option, { apy: 0.0, fetched: false }])
  ) as {
    [option in VaultOptions]: {
      apy: number;
      fetched: boolean;
    };
  },
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
    vaultVersion: VaultVersionList[0],
  },
  notificationLastReadTimestamp: undefined,
};

export const { useGlobalState } = createGlobalState(initialState);
