import React, { ReactElement } from "react";

import { defaultVaultAccountsData, VaultAccountsData } from "../models/vault";
import useFetchSubgraphData from "./useFetchSubgraphData";

export type SubgraphDataContextType = {
  vaultAccounts: VaultAccountsData;
  loading: boolean;
};

export const defaultSubgraphData = {
  vaultAccounts: defaultVaultAccountsData,
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
