import { BigNumber } from "ethers";
import { createGlobalState } from "react-hooks-global-state";
import { DesktopViewType } from "../components/Product/types";
import {
  getAssets,
  getDisplayAssets,
  VaultList,
  VaultOptions,
} from "../constants/constants";
import {
  DefiScoreProtocol,
  DefiScoreToken,
  DefiScoreTokenList,
} from "../models/defiScore";
import { ERC20Token, ERC20TokenList } from "../models/eth";
import { VaultAccount } from "../models/vault";
import { getAssetDecimals } from "../utils/asset";
import {
  PendingTransaction,
  VaultDataResponses,
  Assets,
  AssetsList,
  AssetYieldsInfoData,
  AirdropInfoData,
  V2VaultDataResponses,
} from "./types";

interface GlobalStore {
  vaultData: VaultDataResponses;
  v2VaultData: V2VaultDataResponses;
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
  vaultAccounts: { [option in VaultOptions]: VaultAccount | undefined };
}

export const initialVaultaccounts = Object.fromEntries(
  VaultList.map((option) => [option, undefined])
) as { [option in VaultOptions]: VaultAccount | undefined };

export const initialState: GlobalStore = {
  vaultData: Object.fromEntries(
    VaultList.map((vault) => [
      vault,
      {
        status: "loading",
        deposits: BigNumber.from("0"),
        vaultLimit: BigNumber.from("0"),
        vaultBalanceInAsset: BigNumber.from("0"),
        vaultMaxWithdrawAmount: BigNumber.from("0"),
        asset: getAssets(vault),
        displayAsset: getDisplayAssets(vault),
        decimals: getAssetDecimals(getAssets(vault)),
        userAssetBalance: BigNumber.from("0"),
        maxWithdrawAmount: BigNumber.from("0"),
        error: null,
      },
    ])
  ) as VaultDataResponses,
  v2VaultData: Object.fromEntries(
    VaultList.map((vault) => [
      vault,
      {
        totalBalance: BigNumber.from(0),
        cap: BigNumber.from(0),
        decimals: getAssetDecimals(getAssets(vault)),
        asset: getAssets(vault),
        displayAsset: getDisplayAssets(vault),
        lockedBalanceInAsset: BigNumber.from(0),
        depositBalanceInAsset: BigNumber.from(0),
        userAssetBalance: BigNumber.from(0),
      },
    ])
  ) as V2VaultDataResponses,
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
  vaultAccounts: initialVaultaccounts,
};

export const { useGlobalState } = createGlobalState(initialState);
