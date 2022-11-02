import React, { ReactElement } from "react";

import {
  BalanceUpdate,
  defaultPoolAccountsData,
  defaultPoolActivitiesData,
  PoolAccountsData,
  PoolActivitiesData,
  PoolTransaction,
  PoolsSubgraphData,
  defaultPoolsData,
} from "../models/pool";
import useFetchPoolSubgraphData from "./useFetchPoolSubgraphData";

export type PoolSubgraphDataContextType = {
  pools: PoolsSubgraphData;
  poolAccounts: PoolAccountsData;
  poolActivities: PoolActivitiesData;
  balances: BalanceUpdate[];
  transactions: PoolTransaction[];
  loading: boolean;
};

export type SubgraphDataContextType = {
  poolSubgraphData: PoolSubgraphDataContextType;
};

export const defaultPoolSubgraphData: PoolSubgraphDataContextType = {
  pools: defaultPoolsData,
  poolAccounts: defaultPoolAccountsData,
  poolActivities: defaultPoolActivitiesData,
  balances: [],
  transactions: [],
  loading: true,
};

export const SubgraphDataContext = React.createContext<SubgraphDataContextType>(
  {
    poolSubgraphData: defaultPoolSubgraphData,
  }
);

export const SubgraphDataContextProvider: React.FC<{
  children: ReactElement;
}> = ({ children }) => {
  const poolSubgraphData = useFetchPoolSubgraphData();

  return (
    <SubgraphDataContext.Provider
      value={{
        poolSubgraphData,
      }}
    >
      {children}
    </SubgraphDataContext.Provider>
  );
};
