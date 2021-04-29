import { BigNumber } from "ethers";
import { createGlobalState } from "react-hooks-global-state";
import { getAssets, VaultList } from "../constants/constants";
import { getAssetDecimals } from "../utils/asset";
import {
  PendingTransaction,
  VaultDataResponses,
  Assets,
  AssetsList,
} from "./types";

interface GlobalStore {
  vaultData: VaultDataResponses;
  prices: { [asset in Assets]: number };
  pendingTransactions: PendingTransaction[];
  showConnectWallet: boolean;
  latestAPY: { [asset in Assets]: number };
  gasPrice: string;
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
  latestAPY: Object.fromEntries(AssetsList.map((asset) => [asset, 0.0])) as {
    [asset in Assets]: number;
  },
  gasPrice: "",
};

export const { useGlobalState } = createGlobalState(initialState);
