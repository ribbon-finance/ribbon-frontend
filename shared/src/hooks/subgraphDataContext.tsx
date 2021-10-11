import React, { ReactElement } from "react";
import {
  ERC20TokenAccountSubgraphData,
  ERC20TokenSubgraphData,
} from "../models/token";

import {
  BalanceUpdate,
  defaultV2VaultPriceHistoriesData,
  defaultVaultAccountsData,
  defaultVaultActivitiesData,
  V2VaultPriceHistoriesData,
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
  v2VaultPriceHistory: V2VaultPriceHistoriesData;
  loading: boolean;
};

export const defaultSubgraphData = {
  vaultAccounts: defaultVaultAccountsData,
  vaultActivities: defaultVaultActivitiesData,
  balances: [],
  transactions: [],
  v2VaultPriceHistory: defaultV2VaultPriceHistoriesData,
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
