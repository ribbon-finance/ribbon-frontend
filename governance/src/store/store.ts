import { createGlobalState } from "react-hooks-global-state";

interface GlobalStore {
  showStakingModal: boolean;
}

export const initialState: GlobalStore = {
  showStakingModal: false,
};

export const { useGlobalState: useGovernanceGlobalState } =
  createGlobalState(initialState);
