import React, { ReactElement } from "react";
import {
  ERC20TokenSubgraphData,
  RBNTokenAccountSubgraphData,
} from "../models/token";

import {
  BalanceUpdate,
  defaultV2VaultPriceHistoriesData,
  defaultVaultAccountsData,
  defaultVaultActivitiesData,
  VaultPriceHistoriesData,
  VaultAccountsData,
  VaultActivitiesData,
  VaultTransaction,
  VaultsSubgraphData,
  defaultVaultsData,
} from "../models/vault";
import useFetchSubgraphData from "./useFetchSubgraphData";

export type SubgraphDataContextType = {
  vaults: VaultsSubgraphData;
  vaultAccounts: VaultAccountsData;
  vaultActivities: VaultActivitiesData;
  balances: BalanceUpdate[];
  transactions: VaultTransaction[];
  rbnToken?: ERC20TokenSubgraphData;
  rbnTokenAccount?: RBNTokenAccountSubgraphData;
  vaultPriceHistory: VaultPriceHistoriesData;
  loading: boolean;
};

export const defaultSubgraphData = {
  vaults: defaultVaultsData,
  vaultAccounts: defaultVaultAccountsData,
  vaultActivities: defaultVaultActivitiesData,
  balances: [],
  transactions: [],
  vaultPriceHistory: defaultV2VaultPriceHistoriesData,
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
