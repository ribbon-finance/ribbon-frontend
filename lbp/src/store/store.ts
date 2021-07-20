import { createGlobalState } from "react-hooks-global-state";
import { LBPPoolData } from "../models/lbp";

interface GlobalStore {
  lbpPoolData: {
    fetched: boolean;
    data?: LBPPoolData;
  };
}

export const initialState: GlobalStore = {
  lbpPoolData: {
    fetched: false,
    data: undefined,
  },
};

export const { useGlobalState: useLBPGlobalState } = createGlobalState(
  initialState
);
