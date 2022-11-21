import { BigNumber } from "ethers";
import { useContext } from "react";
import {
  PoolAddressMap,
  PoolList,
  PoolOptions,
  PoolVersion,
  PoolVersionList,
} from "shared/lib/constants/lendConstants";
import { PoolAccount, PoolAccountsData } from "../models/pool";
import { SubgraphDataContext } from "./subgraphDataContext";

const getPoolAccountKey = (pool: PoolOptions) =>
  `poolAccount_${pool.replace(/-/g, "")}`;

export const poolAccountsGraphql = (_account: string, version: PoolVersion) =>
  PoolList.reduce((acc, pool) => {
    let poolAddress = PoolAddressMap[pool][version];

    let account = `${_account}`;

    if (!poolAddress) {
      return acc;
    }

    poolAddress = poolAddress.toLowerCase();
    account = _account.toLowerCase();

    return (
      acc +
      `
          ${getPoolAccountKey(
            pool
          )}: poolAccount(id:"${poolAddress}-${account}") {
            totalDeposits
            totalYieldEarned
            totalBalance
            pool {
              symbol
            }
          }
        `
    );
  }, "");

export const resolvePoolAccountsSubgraphResponse = (responses: {
  [version in PoolVersion]: any | undefined;
}): PoolAccountsData =>
  Object.fromEntries(
    PoolVersionList.map((version) => [
      version,
      Object.fromEntries(
        PoolList.map((pool) => {
          const data = responses[version]
            ? responses[version][getPoolAccountKey(pool)]
            : undefined;

          if (!data) {
            return [pool, undefined];
          }

          return [
            pool,
            {
              ...responses[version][getPoolAccountKey(pool)],
              totalDeposits: BigNumber.from(
                responses[version][getPoolAccountKey(pool)].totalDeposits
              ),
              totalYieldEarned: BigNumber.from(
                responses[version][getPoolAccountKey(pool)].totalYieldEarned
              ),
              totalBalance: BigNumber.from(
                responses[version][getPoolAccountKey(pool)].totalBalance
              ),
            },
          ];
        })
      ),
    ])
  ) as PoolAccountsData;

export const useAllPoolAccounts = () => {
  const contextData = useContext(SubgraphDataContext);
  return {
    data: contextData.poolSubgraphData.poolAccounts,
    loading: contextData.poolSubgraphData.loading,
  };
};

const usePoolAccounts = (variant: PoolVersion | "all") => {
  const contextData = useContext(SubgraphDataContext);

  switch (variant) {
    case "all":
      return {
        poolAccounts: Object.fromEntries(
          PoolList.map((pool) => [
            pool,
            PoolVersionList.reduce((acc, version) => {
              const currentVersionPoolAccount =
                contextData.poolSubgraphData.poolAccounts[version][pool];

              if (!acc) {
                return currentVersionPoolAccount;
              }

              if (!currentVersionPoolAccount) {
                return acc;
              }

              return {
                ...acc,
                totalDeposits: acc.totalDeposits.add(
                  currentVersionPoolAccount.totalDeposits
                ),
                totalYieldEarned: acc.totalYieldEarned.add(
                  currentVersionPoolAccount.totalYieldEarned
                ),
                totalBalance: acc.totalBalance.add(
                  currentVersionPoolAccount.totalBalance
                ),
              };
            }, undefined as PoolAccount | undefined),
          ])
        ),
        loading: false,
      };
    default:
      return {
        poolAccounts: contextData.poolSubgraphData.poolAccounts[variant],
        loading: contextData.poolSubgraphData.loading,
      };
  }
};

export default usePoolAccounts;
