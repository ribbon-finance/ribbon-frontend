import { useContext } from "react";
import { BigNumber } from "ethers";

import { VaultTransaction } from "../models/vault";
import { VaultVersion, VaultVersionList } from "../constants/constants";
import { SubgraphDataContext } from "./subgraphDataContext";

export const transactionsGraphql = (account: string) => `
  vaultTransactions(
    where:{address:"${account}"},
    orderBy: timestamp,
    orderDirection: desc
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
