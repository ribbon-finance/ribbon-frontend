import React, { ReactElement } from "react";
import {
  ERC20TokenAccountSubgraphData,
  ERC20TokenSubgraphData,
} from "../models/token";

import {
  BalanceUpdate,
  defaultVaultAccountsData,
  defaultVaultActivitiesData,
  VaultAccountsData,
  VaultActivitiesData,
  VaultTransaction,
} from "../models/vault";
import useFetchSubgraphData from "./useFetchSubgraphData";

export type SubgraphDataContextType = {
  vaultAccounts: VaultAccountsData;
  vaultActivities: VaultActivitiesData;
  balances: BalanceUpdate[];
  transactions: VaultTransaction[];
  rbnToken?: ERC20TokenSubgraphData;
  rbnTokenAccount?: ERC20TokenAccountSubgraphData;
  loading: boolean;
};

export const defaultSubgraphData = {
  vaultAccounts: defaultVaultAccountsData,
  vaultActivities: defaultVaultActivitiesData,
  balances: [],
  transactions: [],
  loading: true,
};

export const SubgraphDataContext =
  React.createContext<SubgraphDataContextType>(defaultSubgraphData);

export const SubgraphDataContextProvider: React.FC<{ children: ReactElement }> =
  ({ children }) => {
    const subgraphData = useFetchSubgraphData();

    return (
      <SubgraphDataContext.Provider value={subgraphData}>
        {children}
      </SubgraphDataContext.Provider>
    );
  };
