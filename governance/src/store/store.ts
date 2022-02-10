import { createGlobalState } from "react-hooks-global-state";

interface GlobalStore {
  stakingModal: {
    show: boolean;
    mode: "approve" | "stake" | "increase";
    pendingTransaction?: {
      hash: string;
      type: "approve" | "stake" | "increaseDuration" | "increaseAmount";
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
