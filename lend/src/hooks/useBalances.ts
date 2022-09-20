import { BigNumber } from "ethers";
import { useContext } from "react";

import { Chains, VaultVersion, VaultVersionList } from "../constants/constants";
import { BalanceUpdate } from "../models/vault";
import { SubgraphDataContext } from "./subgraphDataContext";

export const balancesGraphql = (account: string, chain: Chains) => `
  balanceUpdates(
    where:{account:"${account}"},
    orderBy: timestamp,
    orderDirection: desc,
    first: 1000
  ) {
    vault {
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
  [version in VaultVersion]: any | undefined;
}): BalanceUpdate[] =>
  VaultVersionList.flatMap((version) =>
    responses[version] && responses[version].balanceUpdates
      ? responses[version].balanceUpdates.reverse().map((item: any) => ({
          ...item,
          balance: BigNumber.from(item.balance),
          yieldEarned: BigNumber.from(item.yieldEarned),
          vaultVersion: version,
        }))
      : []
  ).sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));

const useBalances = () => {
  const contextData = useContext(SubgraphDataContext);
  const balances = contextData.vaultSubgraphData.balances;
  return {
    balances,
    loading: contextData.vaultSubgraphData.loading,
  };
};

export default useBalances;
