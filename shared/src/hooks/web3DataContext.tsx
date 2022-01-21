import React, { ReactElement, useContext } from "react";

import {
  getAssets,
  getDisplayAssets,
  VaultOptions,
} from "../constants/constants";
import {
  defaultLiquidityMiningPoolData,
  LiquidityMiningPoolData,
} from "../models/staking";
import {
  defaultV2VaultData,
  VaultData,
  V2VaultData,
  defaultVaultData,
} from "../models/vault";
import { Assets } from "../store/types";
import { getAssetDecimals } from "../utils/asset";
import useFetchAssetBalanceData, {
  defaultUserAssetBalanceData,
  UserAssetBalanceData,
} from "./useFetchAssetBalanceData";
import useFetchLiquidityMiningData from "./useFetchLiquidityMiningData";
import useFetchV2VaultData from "./useFetchV2VaultData";
import useFetchVaultData from "./useFetchVaultData";
import {
  defaultLidoOracleData,
  LidoOracleData,
  useFetchLidoOracleData,
} from "./useLidoOracle";
import useFetchTreasuryBalanceData, {
  defaultTreasuryBalanceData,
  TreasuryBalanceData,
} from "./useFetchTreasuryBalanceData";

export type Web3DataContextType = {
  v1: VaultData;
  v2: V2VaultData;
  assetBalance: UserAssetBalanceData;
  liquidityMiningPool: LiquidityMiningPoolData;
  lidoOracle: LidoOracleData;
  treasuryBalance: TreasuryBalanceData;
};

export const Web3DataContext = React.createContext<Web3DataContextType>({
  v1: defaultVaultData,
  v2: defaultV2VaultData,
  assetBalance: defaultUserAssetBalanceData,
  liquidityMiningPool: defaultLiquidityMiningPoolData,
  lidoOracle: defaultLidoOracleData,
  treasuryBalance: defaultTreasuryBalanceData,
});

export const useVaultsData = () => {
  const contextData = useContext(Web3DataContext);

  return {
    data: contextData.v1.responses,
    loading: contextData.v1.loading,
  };
};

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
    },
    loading: contextData.v2.loading || contextData.assetBalance.loading,
  };
};

export const useLiquidityMiningPoolData = (vault: VaultOptions) => {
  const contextData = useContext(Web3DataContext);

  return {
    data: contextData.liquidityMiningPool.responses[vault],
    loading: contextData.liquidityMiningPool.loading,
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

export const useTreasuryBalance = () => {
  const contextData = useContext(Web3DataContext);

  return contextData.treasuryBalance;
};

export const Web3DataContextProvider: React.FC<{ children: ReactElement }> = ({
  children,
}) => {
  const vaultData = useFetchVaultData();
  const v2VaultData = useFetchV2VaultData();
  const assetBalance = useFetchAssetBalanceData();
  const liquidityMiningPool = useFetchLiquidityMiningData();
  const lidoOracle = useFetchLidoOracleData();
  const treasuryBalance = useFetchTreasuryBalanceData();

  return (
    <Web3DataContext.Provider
      value={{
        v1: vaultData,
        v2: v2VaultData,
        assetBalance,
        liquidityMiningPool,
        lidoOracle,
        treasuryBalance,
      }}
    >
      {children}
    </Web3DataContext.Provider>
  );
};
