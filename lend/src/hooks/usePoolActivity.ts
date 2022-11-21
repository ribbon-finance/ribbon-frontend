import { useContext } from "react";
import { BigNumber } from "ethers";

import { Chains } from "../constants/constants";
import {
  PoolAddressMap,
  PoolList,
  PoolOptions,
} from "shared/lib/constants/lendConstants";
import {
  PoolVersion,
  PoolVersionList,
} from "shared/lib/constants/lendConstants";
import { PoolActivitiesData } from "../models/pool";
import { SubgraphDataContext } from "./subgraphDataContext";
import { isEVMChain } from "../utils/chains";

const getPoolActivityKey = (
  pool: PoolOptions,
  type: "poolBorrows" | "poolRepays"
) => `poolActivity_${type}_${pool.replace(/-/g, "")}`;

export const poolActivitiesGraphql = (version: PoolVersion, chain: Chains) =>
  PoolList.reduce((acc, pool) => {
    let poolAddress = PoolAddressMap[pool][version];
    if (isEVMChain(chain)) {
      poolAddress = poolAddress?.toLowerCase();
    }
    return (
      acc +
      `
          ${getPoolActivityKey(pool, "poolBorrows")}:
          poolBorrows(where: { pool_in: ["${poolAddress}"] })
          {
            id
            borrowAmount
            borrower
            borrowedAt
            borrowTxhash
          }

          ${getPoolActivityKey(pool, "poolRepays")}:
          poolRepays(where: { pool_in: ["${poolAddress}"] })
          {
            id
            repaidAmount
            repaidAt
            repayTxhash
          }
        `
    );
  }, "");

export const resolvePoolActivitiesSubgraphResponse = (responses: {
  [version in PoolVersion]: any | undefined;
}): PoolActivitiesData =>
  Object.fromEntries(
    PoolVersionList.map((version) => [
      version,
      Object.fromEntries(
        PoolList.map((pool) => {
          const poolBorrowsData = responses[version]
            ? responses[version][getPoolActivityKey(pool, "poolBorrows")] || []
            : [];
          const poolRepaysData = responses[version]
            ? responses[version][getPoolActivityKey(pool, "poolRepays")] || []
            : [];
          return [
            pool,
            [
              ...poolBorrowsData.map((item: any) => ({
                ...item,
                borrowAmount: BigNumber.from(item.borrowAmount),
                date: new Date(item.borrowedAt * 1000),
                type: "borrow",
              })),
              ...poolRepaysData.map((item: any) => ({
                ...item,
                repaidAmount: BigNumber.from(item.repaidAmount),
                date: new Date(item.repaidAt * 1000),
                type: "repay",
              })),
            ],
          ];
        })
      ),
    ])
  ) as PoolActivitiesData;

export const useAllPoolActivities = () => {
  const contextData = useContext(SubgraphDataContext);

  return {
    activities: contextData.poolSubgraphData.poolActivities,
    loading: contextData.poolSubgraphData.loading,
  };
};

const usePoolActivity = (
  pool: PoolOptions,
  poolVersion: PoolVersion = "lend"
) => {
  const contextData = useContext(SubgraphDataContext);
  return {
    activities: contextData.poolSubgraphData.poolActivities[poolVersion][pool],
    loading: contextData.poolSubgraphData.loading,
  };
};

export default usePoolActivity;
