import { BigNumber } from "ethers";
import React, { useContext, useMemo } from "react";

import {
  getAssets,
  getDisplayAssets,
  isSolanaVault,
  VaultOptions,
} from "../constants/constants";
import {
  defaultLiquidityGaugeV5PoolData,
  defaultLiquidityMiningPoolData,
  LiquidityGaugeV5PoolData,
  LiquidityMiningPoolData,
} from "../models/staking";
import {
  defaultV2VaultData,
  VaultData,
  V2VaultData,
  defaultVaultData,
  defaultSolanaVaultData,
  SolanaVaultData,
} from "../models/vault";
import { Assets, AssetsList } from "../store/types";
import { getAssetDecimals } from "../utils/asset";

export type UserAssetBalanceResponses = { [asset in Assets]: BigNumber };
export type UserAssetBalanceData = {
  data: UserAssetBalanceResponses;
  loading: boolean;
};
export const defaultUserAssetBalanceData: UserAssetBalanceData = {
  data: Object.fromEntries(
    AssetsList.map((asset) => [asset, BigNumber.from(0)])
  ) as UserAssetBalanceResponses,
  loading: true,
};

export interface LidoOracleData {
  data: {
    preTotalPooledEther: BigNumber;
    postTotalPooledEther: BigNumber;
    timeElapsed: number;
  };
  loading: boolean;
}

export const defaultLidoOracleData: LidoOracleData = {
  data: {
    preTotalPooledEther: BigNumber.from(0),
    postTotalPooledEther: BigNumber.from(0),
    timeElapsed: 0,
  },
  loading: true,
};

export type TreasuryBalanceResponses = {
  [asset in Assets]: BigNumber;
};
export interface TreasuryBalanceData {
  data: TreasuryBalanceResponses;
  loading: boolean;
}
export const defaultTreasuryBalanceData: TreasuryBalanceData = {
  data: Object.fromEntries(
    AssetsList.map((asset) => [asset, BigNumber.from(0)])
  ) as TreasuryBalanceResponses,
  loading: true,
};

export type Web3DataContextType = {
  v1: VaultData;
  v2: V2VaultData;
  earn: V2VaultData;
  solana: SolanaVaultData;
  assetBalance: UserAssetBalanceData;
  liquidityMiningPool: LiquidityMiningPoolData;
  liquidityGaugeV5Pool: LiquidityGaugeV5PoolData;
  lidoOracle: LidoOracleData;
  treasuryBalance: TreasuryBalanceData;
};

export const Web3DataContext = React.createContext<Web3DataContextType>({
  v1: defaultVaultData,
  v2: defaultV2VaultData,
  earn: defaultV2VaultData,
  solana: defaultSolanaVaultData,
  assetBalance: defaultUserAssetBalanceData,
  liquidityMiningPool: defaultLiquidityMiningPoolData,
  liquidityGaugeV5Pool: defaultLiquidityGaugeV5PoolData,
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
  const data = useMemo(
    () => ({
      ...contextData.v2.responses,
      ...contextData.earn.responses,
      ...contextData.solana.responses,
    }),
    [
      contextData.v2.responses,
      contextData.earn.responses,
      contextData.solana.responses,
    ]
  );

  return {
    data,
    // be pessimistic for loading, if one is still loading, all will be loading
    loading:
      contextData.v2.loading ||
      contextData.earn.loading ||
      contextData.solana.loading,
  };
};

export const useV2VaultData = (vault: VaultOptions) => {
  const contextData = useContext(Web3DataContext);

  const data = useMemo(
    () => ({
      ...contextData.v2.responses,
      ...contextData.earn.responses,
      ...contextData.solana.responses,
    }),
    [
      contextData.v2.responses,
      contextData.earn.responses,
      contextData.solana.responses,
    ]
  );

  const loading =
    (isSolanaVault(vault)
      ? contextData.solana.loading
      : contextData.v2.loading) || contextData.assetBalance.loading;

  return {
    data: {
      ...data[vault],
      asset: getAssets(vault),
      displayAsset: getDisplayAssets(vault),
      decimals: getAssetDecimals(getAssets(vault)),
    },
    loading,
  };
};

export const useLiquidityMiningPoolData = (vault: VaultOptions) => {
  const contextData = useContext(Web3DataContext);

  return {
    data: contextData.liquidityMiningPool.responses[vault],
    loading: contextData.liquidityMiningPool.loading,
  };
};

export const useAllLiquidityGaugeV5PoolsData = () => {
  const contextData = useContext(Web3DataContext);

  return {
    data: contextData.liquidityGaugeV5Pool.responses,
    loading: contextData.liquidityGaugeV5Pool.loading,
  };
};

export const useLiquidityGaugeV5PoolData = (vault: VaultOptions) => {
  const contextData = useContext(Web3DataContext);

  return {
    data: contextData.liquidityGaugeV5Pool.responses[vault],
    loading: contextData.liquidityGaugeV5Pool.loading,
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
