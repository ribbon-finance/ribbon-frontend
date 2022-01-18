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
import useFetchGovernanceSubgraphData from "./useFetchGovernanceSubgraphData";
import useFetchVaultSubgraphData from "./useFetchVaultSubgraphData";

export type VaultSubgraphDataContextType = {
  vaults: VaultsSubgraphData;
  vaultAccounts: VaultAccountsData;
  vaultActivities: VaultActivitiesData;
  balances: BalanceUpdate[];
  transactions: VaultTransaction[];

  vaultPriceHistory: VaultPriceHistoriesData;
  loading: boolean;
};

export type GovernanceSubgraphDataContextType = {
  rbnToken?: ERC20TokenSubgraphData;
  rbnTokenAccount?: RBNTokenAccountSubgraphData;
  loading: boolean;
};

export type SubgraphDataContextType = {
  vaultSubgraphData: VaultSubgraphDataContextType;
  governanceSubgraphData: GovernanceSubgraphDataContextType;
};

export const defaultVaultSubgraphData: VaultSubgraphDataContextType = {
  vaults: defaultVaultsData,
  vaultAccounts: defaultVaultAccountsData,
  vaultActivities: defaultVaultActivitiesData,
  balances: [],
  transactions: [],
  vaultPriceHistory: defaultV2VaultPriceHistoriesData,
  loading: true,
};

export const defaultGovernanceSubgraphData: GovernanceSubgraphDataContextType =
  {
    loading: true,
  };

export const SubgraphDataContext = React.createContext<SubgraphDataContextType>(
  {
    vaultSubgraphData: defaultVaultSubgraphData,
    governanceSubgraphData: defaultGovernanceSubgraphData,
  }
);

export const SubgraphDataContextProvider: React.FC<{
  children: ReactElement;
}> = ({ children }) => {
  const vaultSubgraphData = useFetchVaultSubgraphData();
  const governanceSubgraphData = useFetchGovernanceSubgraphData();

  return (
    <SubgraphDataContext.Provider
      value={{
        vaultSubgraphData,
        governanceSubgraphData,
      }}
    >
      {children}
    </SubgraphDataContext.Provider>
  );
};
