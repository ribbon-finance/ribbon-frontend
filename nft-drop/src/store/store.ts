import { createGlobalState } from "react-hooks-global-state";
import { HomepageView, HomepageViewList } from "./types";

interface GlobalStore {
  shwoInfoModal: boolean;
  homepageView: HomepageView;
  claimButtonWidth: number;
  showClaimModal: boolean;
}

export const initialState: GlobalStore = {
  shwoInfoModal: false,
  homepageView: HomepageViewList[0],
  claimButtonWidth: 0,
  showClaimModal: false,
};

export const { useGlobalState: useNFTDropGlobalState } =
  createGlobalState(initialState);
