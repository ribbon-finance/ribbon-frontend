import { useContext } from "react";
import { BigNumber } from "ethers";

import { VaultTransaction } from "../models/vault";
import { Chains, VaultVersion, VaultVersionList } from "../constants/constants";
import { SubgraphDataContext } from "./subgraphDataContext";
import { isSolanaChain } from "../utils/chains";

export const transactionsGraphql = (account: string, chain: Chains) => `
  vaultTransactions(
    ${
      isSolanaChain(chain)
        ? `where:{address:{_eq:"${account}"}}`
        : `where:{address:"${account}"}`
    },
    ${
      isSolanaChain(chain)
        ? `order_by: { timestamp: desc }`
        : `orderBy: timestamp,
           orderDirection: desc`
    }
  ) {
    id
    type
    vault {
      id
      symbol
    }
    amount
    underlyingAmount
    address
    txhash
    timestamp
  }
`;

export const resolveTransactionsSubgraphResponse = (responses: {
  [version in VaultVersion]: any | undefined;
}): VaultTransaction[] =>
  VaultVersionList.flatMap((version) =>
    responses[version] && responses[version].vaultTransactions
      ? responses[version].vaultTransactions.map((transaction: any) => ({
          ...transaction,
          amount: BigNumber.from(transaction.amount),
          underlyingAmount: BigNumber.from(transaction.underlyingAmount),
          vaultVersion: version,
        }))
      : []
  );

export const useTransactions = () => {
  const contextData = useContext(SubgraphDataContext);

  return {
    transactions: contextData.vaultSubgraphData.transactions,
    loading: contextData.vaultSubgraphData.loading,
  };
};

export default useTransactions;
