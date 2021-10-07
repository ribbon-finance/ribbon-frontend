import React, { ReactElement, useContext } from "react";

import {
  getAssets,
  getDisplayAssets,
  VaultOptions,
} from "../constants/constants";
import { defaultStakingPoolData, StakingPoolData } from "../models/staking";
import {
  defaultV2VaultData,
  VaultData,
  V2VaultData,
  defaultVaultData,
} from "../models/vault";
import { getAssetDecimals } from "../utils/asset";
import useFetchAssetBalanceData, {
  defaultUserAssetBalanceData,
  UserAssetBalanceData,
} from "./useFetchAssetBalanceData";
import useFetchStakingPoolData from "./useFetchStakingPoolData";
import useFetchV2VaultData from "./useFetchV2VaultData";
import useFetchVaultData from "./useFetchVaultData";

export type Web3DataContextType = {
  v1: VaultData;
  v2: V2VaultData;
  assetBalance: UserAssetBalanceData;
  stakingPool: StakingPoolData;
};

export const Web3DataContext = React.createContext<Web3DataContextType>({
  v1: defaultVaultData,
  v2: defaultV2VaultData,
  assetBalance: defaultUserAssetBalanceData,
  stakingPool: defaultStakingPoolData,
});

export const useVaultData = (vault: VaultOptions) => {
  const contextData = useContext(Web3DataContext);

  return {
    ...contextData.v1.responses[vault],
    asset: getAssets(vault),
    displayAsset: getDisplayAssets(vault),
    decimals: getAssetDecimals(getAssets(vault)),
    userAssetBalance: contextData.assetBalance.data[getAssets(vault)],
    status:
      contextData.v1.loading || contextData.assetBalance.loading
        ? "loading"
        : "success",
  };
};

export const useV2VaultsData = () => {
  const contextData = useContext(Web3DataContext);

  return {
    data: contextData.v2.responses,
    loading: contextData.v2.loading,
  };
};

export const useV2VaultData = (vault: VaultOptions) => {
  const contextData = useContext(Web3DataContext);

  return {
    data: {
      ...contextData.v2.responses[vault],
      asset: getAssets(vault),
      displayAsset: getDisplayAssets(vault),
      decimals: getAssetDecimals(getAssets(vault)),
      userAssetBalance: contextData.assetBalance.data[getAssets(vault)],
    },
    loading: contextData.v2.loading || contextData.assetBalance.loading,
  };
};

export const useStakingPoolData = (vault: VaultOptions) => {
  const contextData = useContext(Web3DataContext);

  return {
    data: contextData.stakingPool.responses[vault],
    loading: contextData.stakingPool.loading,
  };
};

export const Web3DataContextProvider: React.FC<{ children: ReactElement }> = ({
  children,
}) => {
  const vaultData = useFetchVaultData();
  const v2VaultData = useFetchV2VaultData();
  const assetBalance = useFetchAssetBalanceData();
  const stakingPool = useFetchStakingPoolData();

  return (
    <Web3DataContext.Provider
      value={{
        v1: vaultData,
        v2: v2VaultData,
        assetBalance,
        stakingPool,
      }}
    >
      {children}
    </Web3DataContext.Provider>
  );
};
