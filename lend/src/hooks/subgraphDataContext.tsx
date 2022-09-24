import React, { ReactElement } from "react";

import {
  BalanceUpdate,
  defaultVaultAccountsData,
  defaultVaultActivitiesData,
  VaultAccountsData,
  VaultActivitiesData,
  VaultTransaction,
  VaultsSubgraphData,
  defaultVaultsData,
} from "../models/vault";
import useFetchVaultSubgraphData from "./useFetchVaultSubgraphData";

export type VaultSubgraphDataContextType = {
  vaults: VaultsSubgraphData;
  vaultAccounts: VaultAccountsData;
  vaultActivities: VaultActivitiesData;
  balances: BalanceUpdate[];
  transactions: VaultTransaction[];
  loading: boolean;
};

export type SubgraphDataContextType = {
  vaultSubgraphData: VaultSubgraphDataContextType;
};

export const defaultVaultSubgraphData: VaultSubgraphDataContextType = {
  vaults: defaultVaultsData,
  vaultAccounts: defaultVaultAccountsData,
  vaultActivities: defaultVaultActivitiesData,
  balances: [],
  transactions: [],
  loading: true,
};

export const SubgraphDataContext = React.createContext<SubgraphDataContextType>(
  {
    vaultSubgraphData: defaultVaultSubgraphData,
  }
);

export const SubgraphDataContextProvider: React.FC<{
  children: ReactElement;
}> = ({ children }) => {
  const vaultSubgraphData = useFetchVaultSubgraphData();

  return (
    <SubgraphDataContext.Provider
      value={{
        vaultSubgraphData,
      }}
    >
      {children}
    </SubgraphDataContext.Provider>
  );
};
