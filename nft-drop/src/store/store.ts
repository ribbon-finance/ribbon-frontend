import { createGlobalState } from "react-hooks-global-state";

interface GlobalStore {
  shwoInfoModal: boolean;
}

export const initialState: GlobalStore = {
  shwoInfoModal: false,
};

export const { useGlobalState: useNFTDropGlobalState } =
  createGlobalState(initialState);
