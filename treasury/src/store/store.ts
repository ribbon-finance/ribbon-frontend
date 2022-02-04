import { createGlobalState } from "react-hooks-global-state";
import { VaultOptions, VaultVersion } from "shared/lib/constants/constants";
import { Assets } from "shared/lib/store/types";
import {
  ACTIONS,
  ActionType,
  V2WithdrawOption,
} from "webapp/lib/components/Vault/VaultActionsForm/Modal/types";
import { TreasuryVaultOptions } from "../constants/constants";

interface GlobalStore {
  vaultActionForm: {
    vaultOption?: VaultOptions;
    vaultVersion: VaultVersion;
    inputAmount: string;
    actionType: ActionType;
    depositAsset?: Assets;
    withdrawOption?: V2WithdrawOption;
    migrateSourceVault?: VaultOptions;
    receiveVault?: VaultOptions;
  };
}

export const initialVaultActionForm = {
  vaultVersion: "v1" as VaultVersion,
  inputAmount: "",
  // Default to deposit
  actionType: ACTIONS.deposit,
};

export const initialState: GlobalStore = {
  vaultActionForm: initialVaultActionForm,
};

export const { useGlobalState: useWebappGlobalState } =
  createGlobalState(initialState);

interface GlobalAccessStore {
  access: TreasuryVaultOptions[];
}

export const initialAccessState: GlobalAccessStore = {
  access: [],
};

export const { useGlobalState: useGlobalAccessState } =
  createGlobalState(initialAccessState);
