import { BigNumber } from "ethers";
import { useContext } from "react";

import { Chains } from "../constants/constants";
import {
  PoolVersion,
  PoolVersionList,
} from "shared/lib/constants/lendConstants";
import { BalanceUpdate } from "../models/pool";
import { SubgraphDataContext } from "./subgraphDataContext";

export const balancesGraphql = (account: string, chain: Chains) => `
  balanceUpdates(
    where:{account:"${account}"},
    orderBy: timestamp,
    orderDirection: desc,
    first: 1000
  ) {
    pool {
      symbol
      name
    }
    timestamp
    balance
    yieldEarned
    isWithdraw
  }
`;

export const resolveBalancesSubgraphResponse = (responses: {
  [version in PoolVersion]: any | undefined;
}): BalanceUpdate[] =>
  PoolVersionList.flatMap((version) =>
    responses[version] && responses[version].balanceUpdates
      ? responses[version].balanceUpdates.reverse().map((item: any) => ({
          ...item,
          balance: BigNumber.from(item.balance),
          yieldEarned: BigNumber.from(item.yieldEarned),
          poolVersion: version,
        }))
      : []
  ).sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));

const useBalances = () => {
  const contextData = useContext(SubgraphDataContext);
  const balances = contextData.poolSubgraphData.balances;
  return {
    balances,
    loading: contextData.poolSubgraphData.loading,
  };
};

export default useBalances;
