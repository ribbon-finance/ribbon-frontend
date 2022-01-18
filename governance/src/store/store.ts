import { createGlobalState } from "react-hooks-global-state";

interface GlobalStore {
  stakingModal: {
    show: boolean;
    mode: "approve" | "stake";
    pendingTransaction?: {
      hash: string;
      type: "approve" | "stake";
    };
  };
}

export const initialState: GlobalStore = {
  stakingModal: {
    show: false,
    mode: "stake",
  },
};

export const { useGlobalState: useGovernanceGlobalState } =
  createGlobalState(initialState);
