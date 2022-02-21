import { BigNumber } from "ethers";
import { useContext } from "react";

import { Chains, VaultVersion, VaultVersionList } from "../constants/constants";
import { BalanceUpdate } from "../models/vault";
import { isSolanaChain } from "../utils/chains";
import { SubgraphDataContext } from "./subgraphDataContext";

export const balancesGraphql = (account: string, chain: Chains) => `
  balanceUpdates(
    ${
      isSolanaChain(chain)
        ? `where:{account:{_eq:"${account}"}}`
        : `where:{account:"${account}"}`
    },
    ${
      isSolanaChain(chain)
        ? `order_by: { timestamp: desc },`
        : `orderBy: timestamp,
           orderDirection: desc,`
    }
    ${isSolanaChain(chain) ? "limit: 1000" : "first: 1000"}
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
