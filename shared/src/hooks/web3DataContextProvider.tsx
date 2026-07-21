import React, { ReactElement } from "react";

import { Web3DataContext } from "./web3DataContext";
import useFetchAssetBalanceData from "./useFetchAssetBalanceData";
import useFetchEarnVaultData from "./useFetchEarnVaultData";
import useFetchLiquidityGaugeV5Data from "./useFetchLiquidityGaugeV5Data";
import useFetchLiquidityMiningData from "./useFetchLiquidityMiningData";
import useFetchSolVaultData from "./useFetchSolVaultData";
import useFetchTreasuryBalanceData from "./useFetchTreasuryBalanceData";
import useFetchV2VaultData from "./useFetchV2VaultData";
import useFetchVaultData from "./useFetchVaultData";
import { useFetchLidoOracleData } from "./useLidoOracle";

type Web3DataContextProviderProps = {
  children: ReactElement;
  fetchAssetBalances?: boolean;
  fetchVaultData?: boolean;
  fetchLiquidityGaugeV5?: boolean;
  fetchLiquidityMining?: boolean;
  fetchSolanaVaults?: boolean;
  fetchLidoOracle?: boolean;
  fetchTreasuryBalance?: boolean;
  includeAccountData?: boolean;
};

export const Web3DataContextProvider: React.FC<
  Web3DataContextProviderProps
> = ({
  children,
  fetchAssetBalances = true,
  fetchVaultData = true,
  fetchLiquidityGaugeV5 = true,
  fetchLiquidityMining = true,
  fetchSolanaVaults = true,
  fetchLidoOracle = true,
  fetchTreasuryBalance = true,
  includeAccountData = true,
}) => {
  const vaultData = useFetchVaultData({
    enabled: fetchVaultData,
    includeAccountData,
  });
  const v2VaultData = useFetchV2VaultData({
    enabled: fetchVaultData,
    includeAccountData,
  });
  const earnVaultData = useFetchEarnVaultData({
    enabled: fetchVaultData,
    includeAccountData,
  });
  const solVaultData = useFetchSolVaultData({ enabled: fetchSolanaVaults });
  const assetBalance = useFetchAssetBalanceData({
    enabled: fetchAssetBalances,
    poll: false,
    pollingFrequency: 20000,
  });
  const liquidityGaugeV5Pool = useFetchLiquidityGaugeV5Data({
    enabled: fetchLiquidityGaugeV5,
    includeAccountData,
  });
  const liquidityMiningPool = useFetchLiquidityMiningData({
    enabled: fetchLiquidityMining,
    includeAccountData,
  });
  const lidoOracle = useFetchLidoOracleData({ enabled: fetchLidoOracle });
  const treasuryBalance = useFetchTreasuryBalanceData({
    enabled: fetchTreasuryBalance,
  });

  return (
    <Web3DataContext.Provider
      value={{
        v1: vaultData,
        v2: v2VaultData,
        earn: earnVaultData,
        solana: solVaultData,
        assetBalance,
        liquidityGaugeV5Pool,
        liquidityMiningPool,
        lidoOracle,
        treasuryBalance,
      }}
    >
      {children}
    </Web3DataContext.Provider>
  );
};
