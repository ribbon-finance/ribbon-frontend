import { BigNumber } from "ethers";
import { createGlobalState } from "react-hooks-global-state";
import { PendingTransaction, VaultDataResponse } from "./types";

interface GlobalStore {
  vaultData: VaultDataResponse;
  prices: {
    WETH: number;
  };
  pendingTransactions: PendingTransaction[];
  showConnectWallet: boolean;
}

export const initialState: GlobalStore = {
  vaultData: {
    status: "loading",
    deposits: BigNumber.from("0"),
    vaultLimit: BigNumber.from("0"),
    vaultBalanceInAsset: BigNumber.from("0"),
    userAssetBalance: BigNumber.from("0"),
    maxWithdrawAmount: BigNumber.from("0"),
    error: null,
  },
  prices: {
    WETH: 0.0,
  },
  pendingTransactions: [],
  showConnectWallet: false,
};

export const { useGlobalState } = createGlobalState(initialState);
