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
import { getAssetDecimals } from "../utils/asset";
import {
  PendingTransaction,
  VaultDataResponses,
  Assets,
  AssetsList,
  AssetYieldsInfoData,
} from "./types";

interface GlobalStore {
  vaultData: VaultDataResponses;
  prices: { [asset in Assets]: number };
  pendingTransactions: PendingTransaction[];
  showConnectWallet: boolean;
  latestAPY: { [option in VaultOptions]: number };
  assetYieldsInfo: {
    fetched: boolean;
    data: AssetYieldsInfoData;
  };
  gasPrice: string;
  desktopView: DesktopViewType;
}

export const initialState: GlobalStore = {
  vaultData: Object.fromEntries(
    VaultList.map((vault) => [
      vault,
      {
        status: "loading",
        deposits: BigNumber.from("0"),
        vaultLimit: BigNumber.from("0"),
        vaultBalanceInAsset: BigNumber.from("0"),
        asset: getAssets(vault),
        displayAsset: getDisplayAssets(vault),
        decimals: getAssetDecimals(getAssets(vault)),
        userAssetBalance: BigNumber.from("0"),
        maxWithdrawAmount: BigNumber.from("0"),
        error: null,
      },
    ])
  ) as VaultDataResponses,
  prices: Object.fromEntries(AssetsList.map((asset) => [asset, 0.0])) as {
    [asset in Assets]: number;
  },
  pendingTransactions: [],
  showConnectWallet: false,
  latestAPY: Object.fromEntries(VaultList.map((option) => [option, 0.0])) as {
    [option in VaultOptions]: number;
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
};

export const { useGlobalState } = createGlobalState(initialState);
