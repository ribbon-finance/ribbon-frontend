import { BigNumber } from "ethers";
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
import { ERC20Token, ERC20TokenList } from "../models/eth";
import { VaultAccount } from "../models/vault";
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
  tokenBalances: {
    [token in ERC20Token]: { fetched: boolean; balance: BigNumber };
  };
  vaultAccounts: {
    [version in VaultVersion | "all"]: {
      [option in VaultOptions]: VaultAccount | undefined;
    };
  };
  vaultPositionModal: {
    show: boolean;
    vaultOption?: VaultOptions;
    vaultVersion: VaultVersion;
  };
}

export const initialVaultAccounts = Object.fromEntries(
  [...VaultVersionList, "all"].map((version) => [
    version,
    Object.fromEntries(VaultList.map((option) => [option, undefined])),
  ])
) as {
  [version in VaultVersion | "all"]: {
    [option in VaultOptions]: VaultAccount | undefined;
  };
};

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
  tokenBalances: Object.fromEntries(
    ERC20TokenList.map((token) => [
      token,
      { balance: BigNumber.from(0), fetched: false },
    ])
  ) as {
    [token in ERC20Token]: { fetched: boolean; balance: BigNumber };
  },
  vaultAccounts: initialVaultAccounts,
  vaultPositionModal: {
    show: false,
    vaultVersion: VaultVersionList[0],
  },
};

export const { useGlobalState } = createGlobalState(initialState);
