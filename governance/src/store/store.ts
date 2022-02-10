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
  unstakingModal: {
    show: boolean;
    pendingTransaction?: {
      hash: string;
    };
  };
}

export const initialState: GlobalStore = {
  stakingModal: {
    show: false,
    mode: "stake",
  },
  unstakingModal: {
    show: false,
  },
};

export const { useGlobalState: useGovernanceGlobalState } =
  createGlobalState(initialState);
