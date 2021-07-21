import { createGlobalState } from "react-hooks-global-state";
import { LBPPoolData } from "../models/lbp";

interface GlobalStore {
  lbpPoolData: {
    fetched: boolean;
    data?: LBPPoolData;
  };
  swapModal: {
    show: boolean;
    offerToken: "USDC" | "RBN";
    receiveToken: "USDC" | "RBN";
  };
}

export const initialState: GlobalStore = {
  lbpPoolData: {
    fetched: false,
    data: undefined,
  },
  swapModal: {
    show: false,
    offerToken: "USDC",
    receiveToken: "RBN",
  },
};

export const { useGlobalState: useLBPGlobalState } = createGlobalState(
  initialState
);
