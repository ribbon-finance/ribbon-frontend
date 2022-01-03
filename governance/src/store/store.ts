import { createGlobalState } from "react-hooks-global-state";

interface GlobalStore {}

export const initialState: GlobalStore = {};

export const { useGlobalState: useGovernanceGlobalState } =
  createGlobalState(initialState);
