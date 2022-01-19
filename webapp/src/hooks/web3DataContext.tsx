import React, { ReactElement, useContext } from "react";

import {
  getAssets,
  getDisplayAssets,
  VaultOptions,
} from "shared/lib/constants/constants";
import {
  defaultStakingPoolData,
  StakingPoolData,
} from "shared/lib/models/staking";
import {
  defaultV2VaultData,
  VaultData,
  V2VaultData,
  defaultVaultData,
  defaultSolanaVaultData,
  SolanaVaultData,
} from "shared/lib/models/vault";
import { Assets } from "shared/lib/store/types";
import { getAssetDecimals } from "shared/lib/utils/asset";
import useFetchAssetBalanceData, {
  defaultUserAssetBalanceData,
  UserAssetBalanceData,
} from "shared/lib/hooks/useFetchAssetBalanceData";
import useFetchStakingPoolData from "shared/lib/hooks/useFetchStakingPoolData";
import useFetchV2VaultData from "shared/lib/hooks/useFetchV2VaultData";
import useFetchVaultData from "shared/lib/hooks/useFetchVaultData";
import {
  defaultLidoOracleData,
  LidoOracleData,
  useFetchLidoOracleData,
} from "shared/lib/hooks/useLidoOracle";
import useFetchTreasuryBalanceData, {
  defaultTreasuryBalanceData,
  TreasuryBalanceData,
} from "shared/lib/hooks/useFetchTreasuryBalanceData";
import useFetchSolVaultData from "shared/lib/hooks/useFetchSolVaultData";

export type Web3DataContextType = {
  v1: VaultData;
  v2: V2VaultData;
  solana: SolanaVaultData;
  assetBalance: UserAssetBalanceData;
  stakingPool: StakingPoolData;
  lidoOracle: LidoOracleData;
  treasuryBalance: TreasuryBalanceData;
};

export const Web3DataContext = React.createContext<Web3DataContextType>({
  v1: defaultVaultData,
  v2: defaultV2VaultData,
  solana: defaultSolanaVaultData,
  assetBalance: defaultUserAssetBalanceData,
  stakingPool: defaultStakingPoolData,
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
    data: { ...contextData.v2.responses, ...contextData.solana.responses },
    loading: contextData.v2.loading && contextData.solana.loading,
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

export const useStakingPoolData = (vault: VaultOptions) => {
  const contextData = useContext(Web3DataContext);

  return {
    data: contextData.stakingPool.responses[vault],
    loading: contextData.stakingPool.loading,
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
  const solVaultData = useFetchSolVaultData();
  const assetBalance = useFetchAssetBalanceData();
  const stakingPool = useFetchStakingPoolData();
  const lidoOracle = useFetchLidoOracleData();
  const treasuryBalance = useFetchTreasuryBalanceData();

  return (
    <Web3DataContext.Provider
      value={{
        v1: vaultData,
        v2: v2VaultData,
        solana: solVaultData,
        assetBalance,
        stakingPool,
        lidoOracle,
        treasuryBalance,
      }}
    >
      {children}
    </Web3DataContext.Provider>
  );
};
