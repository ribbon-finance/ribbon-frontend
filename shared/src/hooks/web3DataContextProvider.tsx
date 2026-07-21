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

export const Web3DataContextProvider: React.FC<{ children: ReactElement }> = ({
  children,
}) => {
  const vaultData = useFetchVaultData();
  const v2VaultData = useFetchV2VaultData();
  const earnVaultData = useFetchEarnVaultData();
  const solVaultData = useFetchSolVaultData();
  const assetBalance = useFetchAssetBalanceData();
  const liquidityGaugeV5Pool = useFetchLiquidityGaugeV5Data();
  const liquidityMiningPool = useFetchLiquidityMiningData();
  const lidoOracle = useFetchLidoOracleData();
  const treasuryBalance = useFetchTreasuryBalanceData();

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
