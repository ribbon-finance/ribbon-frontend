import React, { ReactElement, useContext } from "react";

import {
  getAssets,
  getDisplayAssets,
  PoolOptions,
} from "../constants/constants";
import { PoolData, defaultPoolData } from "../models/pool";
import { getAssetDecimals } from "../utils/asset";
import useFetchPoolData from "./useFetchPoolData";
import useFetchAssetBalanceData, {
  defaultUserAssetBalanceData,
  UserAssetBalanceData,
} from "./useFetchAssetBalanceData";
import { Assets } from "../store/types";

export type Web3DataContextType = {
  lend: PoolData;
  assetBalance: UserAssetBalanceData;
};

export const Web3DataContext = React.createContext<Web3DataContextType>({
  lend: defaultPoolData,
  assetBalance: defaultUserAssetBalanceData,
});

export const usePoolsData = () => {
  const contextData = useContext(Web3DataContext);

  return {
    data: contextData.lend.responses,
    loading: contextData.lend.loading,
  };
};

export const usePoolData = (pool: PoolOptions) => {
  const contextData = useContext(Web3DataContext);

  return {
    ...contextData.lend.responses[pool],
    asset: getAssets(pool),
    displayAsset: getDisplayAssets(pool),
    decimals: getAssetDecimals(getAssets(pool)),
    userAssetBalance: contextData.assetBalance.data[getAssets(pool)],
    status:
      contextData.lend.loading || contextData.assetBalance.loading
        ? "loading"
        : "success",
  };
};

export const useAssetBalance = (asset: Assets) => {
  const contextData = useContext(Web3DataContext);

  return {
    balance: contextData.assetBalance.data[asset],
    loading: contextData.assetBalance.loading,
  };
};

export const useAssetsBalance = () => {
  const contextData = useContext(Web3DataContext);

  return contextData.assetBalance;
};

export const Web3DataContextProvider: React.FC<{ children: ReactElement }> = ({
  children,
}) => {
  const poolData = useFetchPoolData();
  const assetBalance = useFetchAssetBalanceData();

  return (
    <Web3DataContext.Provider
      value={{
        lend: poolData,
        assetBalance: assetBalance,
      }}
    >
      {children}
    </Web3DataContext.Provider>
  );
};
