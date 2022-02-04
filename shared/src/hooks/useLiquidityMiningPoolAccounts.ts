import { BigNumber } from "@ethersproject/bignumber";
import { useContext } from "react";

import {
  VaultLiquidityMiningMap,
  VaultOptions,
  VaultVersion,
} from "../constants/constants";
import { LiquidityMiningPoolAccountsData } from "../models/staking";
import { SubgraphDataContext } from "./subgraphDataContext";

const getLMAccountKey = (vault: VaultOptions) =>
  `lmAccount_${vault.replace(/-/g, "")}`;

export const liquidityMiningPoolAccountsGraphql = (
  account: string,
  version: VaultVersion
) =>
  version === "v1"
    ? Object.keys(VaultLiquidityMiningMap.lm).reduce(
        (acc, curr) =>
          acc +
          `
  ${getLMAccountKey(
    curr as VaultOptions
  )}: vaultLiquidityMiningPoolAccount(id:"${VaultLiquidityMiningMap.lm[
            curr as VaultOptions
          ]!.toLowerCase()}-${account.toLowerCase()}") {
              pool {
                numDepositors
                totalSupply
                totalRewardClaimed
              }
              totalRewardClaimed
              totalBalance
            }
  `,
        ""
      )
    : "";

export const resolveLiquidityMiningPoolAccountsSubgraphResponse = (responses: {
  [version in VaultVersion]: any | undefined;
}): LiquidityMiningPoolAccountsData =>
  Object.fromEntries(
    Object.keys(VaultLiquidityMiningMap.lm).map((vaultOption) => {
      const data = responses["v1"]
        ? responses["v1"][getLMAccountKey(vaultOption as VaultOptions)]
        : undefined;

      return [
        vaultOption,
        data
          ? {
              ...data,
              totalRewardClaimed: BigNumber.from(data.totalRewardClaimed),
              totalBalance: BigNumber.from(data.totalBalance),
              pool: {
                ...data.pool,
                totalSupply: BigNumber.from(data.pool.totalSupply),
                totalRewardClaimed: BigNumber.from(
                  data.pool.totalRewardClaimed
                ),
              },
            }
          : undefined,
      ];
    })
  );

const useLiquidityMiningPoolAccounts = () => {
  const context = useContext(SubgraphDataContext);

  return {
    stakingAccounts: context.vaultSubgraphData.stakingAccounts.lm,
    loading: context.vaultSubgraphData.loading,
  };
};

export default useLiquidityMiningPoolAccounts;
