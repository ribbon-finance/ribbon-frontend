import { BigNumber } from "@ethersproject/bignumber";
import { useContext } from "react";

import {
  isEthNetwork,
  VaultLiquidityMiningMap,
  VaultOptions,
  VaultVersion,
} from "../constants/constants";
import { LiquidityMiningPoolsSubgraphData } from "../models/staking";
import { SubgraphDataContext } from "./subgraphDataContext";

const getLMPoolKey = (vault: VaultOptions) => `lm_${vault.replace(/-/g, "")}`;

export const liquidityMiningPoolGraphql = (
  version: VaultVersion,
  chainId: number
) =>
  version === "v1" && isEthNetwork(chainId)
    ? Object.keys(VaultLiquidityMiningMap.lm).reduce(
        (acc, curr) =>
          acc +
          `
      ${getLMPoolKey(
        curr as VaultOptions
      )}: vaultLiquidityMiningPool(id:"${VaultLiquidityMiningMap.lm[
            curr as VaultOptions
          ]!.toLowerCase()}") {
              numDepositors
              totalSupply
              totalRewardClaimed
            }
    `,
        ""
      )
    : ``;

export const resolveLiquidityMiningPoolsSubgraphResponse = (responses: {
  [version in VaultVersion]: any | undefined;
}): LiquidityMiningPoolsSubgraphData =>
  Object.fromEntries(
    Object.keys(VaultLiquidityMiningMap.lm).map((vaultOption) => {
      const data = responses["v1"]
        ? responses["v1"][getLMPoolKey(vaultOption as VaultOptions)]
        : undefined;

      return [
        vaultOption,
        data
          ? {
              ...data,
              totalSupply: BigNumber.from(data.totalSupply),
              totalRewardClaimed: BigNumber.from(data.totalRewardClaimed),
            }
          : undefined,
      ];
    })
  );

const useLiquidityMiningPools = () => {
  const context = useContext(SubgraphDataContext);

  return {
    stakingPools: context.vaultSubgraphData.stakingPools.lm,
    loading: context.vaultSubgraphData.loading,
  };
};

export default useLiquidityMiningPools;
