import { BigNumber } from "ethers";
import { createGlobalState } from "react-hooks-global-state";
import { PendingTransaction, PoolDataResponse } from "./types";

interface GlobalStore {
  poolData: PoolDataResponse;
  prices: {
    WETH: number;
  };
  pendingTransactions: PendingTransaction[];
  showConnectWallet: boolean;
  latestAPY: number;
  gasPrice: string;
}

export const initialState: GlobalStore = {
  poolData: {
    status: "loading",
    deposits: BigNumber.from("0"),
    poolLimit: BigNumber.from("0"),
    error: null,
  },
  prices: {
    WETH: 0.0,
  },
  pendingTransactions: [],
  showConnectWallet: false,
  latestAPY: 0.0,
  gasPrice: "",
};

export const { useGlobalState } = createGlobalState(initialState);
