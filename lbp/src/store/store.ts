import { createGlobalState } from "react-hooks-global-state";

import { ERC20Token } from "shared/lib/models/eth";
import { LBPPoolData } from "../models/lbp";

interface GlobalStore {
  lbpPoolData: {
    fetched: boolean;
    data?: LBPPoolData;
  };
  swapModal: {
    show: boolean;
    offerToken: ERC20Token;
    receiveToken: ERC20Token;
  };
}

export const initialState: GlobalStore = {
  lbpPoolData: {
    fetched: false,
    data: undefined,
  },
  swapModal: {
    show: false,
    offerToken: "usdc",
    receiveToken: "rbn",
  },
};

export const { useGlobalState: useLBPGlobalState } =
  createGlobalState(initialState);
