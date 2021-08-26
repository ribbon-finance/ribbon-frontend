import { createGlobalState } from "react-hooks-global-state";
import {
  VaultOptions,
  VaultVersion,
  VaultVersionList,
} from "shared/lib/constants/constants";
import {
  ACTIONS,
  ActionType,
} from "../components/Vault/VaultActionsForm/Modal/types";

interface GlobalStore {
  vaultActionForm: {
    vaultOption?: VaultOptions;
    vaultVersion: VaultVersion;
    inputAmount: string;
    actionType: ActionType;
    receiveVault?: VaultOptions;
  };
}

export const initialVaultActionForm = {
  vaultVersion: VaultVersionList[0],
  inputAmount: "",
  // Default to deposit
  actionType: ACTIONS.deposit,
};

export const initialState: GlobalStore = {
  vaultActionForm: initialVaultActionForm,
};

export const { useGlobalState: useWebappGlobalState } =
  createGlobalState(initialState);
