import { createGlobalState } from "react-hooks-global-state";
import { Assets } from "./types";
import { DesktopViewType } from "shared/lib/components/Product/types";
import { VaultOptions, VaultVersion } from "../constants/constants";
import {
  ACTIONS,
  ActionType,
  V2WithdrawOption,
} from "../components/Vault/VaultActionsForm/Modal/types";

import {
  DefiScoreProtocol,
  DefiScoreToken,
  DefiScoreTokenList,
} from "shared/lib/models/defiScore";

import {
  PendingTransaction,
  AssetYieldsInfoData,
  AirdropInfoData,
} from "./types";

interface WebappGlobalStore {
  vaultActionForm: {
    vaultOption?: VaultOptions;
    vaultVersion: VaultVersion;
    inputAmount: string;
    actionType: ActionType;
    depositAsset?: Assets;
    withdrawOption?: V2WithdrawOption;
    receiveVault?: VaultOptions;
  };
}

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

export const initialVaultActionForm = {
  vaultVersion: "v1" as VaultVersion,
  inputAmount: "",
  // Default to deposit
  actionType: ACTIONS.deposit,
};

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

export const webappInitialState: WebappGlobalStore = {
  vaultActionForm: initialVaultActionForm,
};

export const { useGlobalState } = createGlobalState(initialState);
export const { useGlobalState: useWebappGlobalState } =
  createGlobalState(webappInitialState);
