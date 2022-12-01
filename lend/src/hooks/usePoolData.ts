import { BigNumber } from "@ethersproject/bignumber";
import { useContext } from "react";
import { Chains, CHAINS_TO_ID } from "../constants/constants";
import {
  PoolAddressMap,
  PoolList,
  PoolOptions,
} from "shared/lib/constants/lendConstants";
import {
  PoolVersion,
  PoolVersionList,
} from "shared/lib/constants/lendConstants";
import { PoolsSubgraphData } from "../models/pool";
import { isEVMChain } from "../utils/chains";
import { SubgraphDataContext } from "./subgraphDataContext";

const getPoolKey = (pool: PoolOptions) => `pool_${pool.replace(/-/g, "")}`;

export const poolGraphql = (version: PoolVersion, chain: Chains) =>
  PoolList.reduce((acc, pool) => {
    let poolAddress = PoolAddressMap[pool][version];

    if (!poolAddress || PoolAddressMap[pool].chainId !== CHAINS_TO_ID[chain]) {
      return acc;
    }

    if (isEVMChain(chain)) {
      poolAddress = poolAddress?.toLowerCase();
    }

    return `
          ${getPoolKey(pool)}: pool(id: "${poolAddress}" ){
            id
            name
            symbol
            totalBalance
            totalPremiumEarned
            totalFeeCollected
            totalNominalVolume
            totalNotionalVolume
          }
        `;
  }, "");

export const resolvePoolsSubgraphResponse = (responses: {
  [version in PoolVersion]: any | undefined;
}): PoolsSubgraphData =>
  Object.fromEntries(
    PoolVersionList.map((version) => [
      version,
      Object.fromEntries(
        PoolList.map((pool) => {
          const poolData = responses[version]
            ? responses[version][getPoolKey(pool)]
            : undefined;

          return [
            pool,
            poolData
              ? {
                  ...poolData,
                  totalBalance: BigNumber.from(poolData.totalBalance),
                }
              : undefined,
          ];
        })
      ),
    ])
  ) as PoolsSubgraphData;

export const usePoolsSubgraphData = () => {
  const contextData = useContext(SubgraphDataContext);

  return {
    data: contextData.poolSubgraphData.pools,
    loading: contextData.poolSubgraphData.loading,
  };
};
