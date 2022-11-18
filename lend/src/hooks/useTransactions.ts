import { useContext } from "react";
import { BigNumber } from "ethers";

import { PoolTransaction } from "../models/pool";
import { Chains } from "../constants/constants";

import {
  PoolVersion,
  PoolVersionList,
} from "shared/lib/constants/lendConstants";
import { SubgraphDataContext } from "./subgraphDataContext";

export const transactionsGraphql = (account: string, chain: Chains) => `
  poolTransactions(
    where:{address:"${account}"},
    orderBy: timestamp,
    orderDirection: desc
  ) {
    id
    type
    pool {
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
  [version in PoolVersion]: any | undefined;
}): PoolTransaction[] =>
  PoolVersionList.flatMap((version) =>
    responses[version] && responses[version].poolTransactions
      ? responses[version].poolTransactions.map((transaction: any) => ({
          ...transaction,
          amount: BigNumber.from(transaction.amount),
          underlyingAmount: BigNumber.from(transaction.underlyingAmount),
          poolVersion: version,
        }))
      : []
  );

export const useTransactions = () => {
  const contextData = useContext(SubgraphDataContext);

  return {
    transactions: contextData.poolSubgraphData.transactions,
    loading: contextData.poolSubgraphData.loading,
  };
};

export default useTransactions;
