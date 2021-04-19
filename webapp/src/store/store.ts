import { BigNumber } from "ethers";
import { createGlobalState } from "react-hooks-global-state";
import { getDecimals, VaultList } from "../constants/constants";
import { PendingTransaction, VaultDataResponses } from "./types";

interface GlobalStore {
  vaultData: VaultDataResponses;
  prices: {
    WETH: number;
  };
  pendingTransactions: PendingTransaction[];
  showConnectWallet: boolean;
  latestAPY: number;
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
        decimals: getDecimals(vault),
        userAssetBalance: BigNumber.from("0"),
        maxWithdrawAmount: BigNumber.from("0"),
        error: null,
      },
    ])
  ) as VaultDataResponses,
  prices: {
    WETH: 0.0,
  },
  pendingTransactions: [],
  showConnectWallet: false,
  latestAPY: 0.0,
  gasPrice: "",
};

export const { useGlobalState } = createGlobalState(initialState);
