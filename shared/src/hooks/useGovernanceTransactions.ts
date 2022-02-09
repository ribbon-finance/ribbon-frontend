import { BigNumber } from "ethers";
import { useContext } from "react";
import { GovernanceTransaction } from "../models/governance";
import { SubgraphDataContext } from "./subgraphDataContext";

export const governanceTransactionsGraphql = (
  account: string | null | undefined
) => `
  governanceTransactions(
    where:{address:"${account}"},
    orderBy: timestamp,
    orderDirection: desc
  ) {
    id
    type
    amount
    address
    txhash
    timestamp
  }
`;

export const resolveGovernanceTransactionsSubgraphResponse = (
  response: any | undefined
): GovernanceTransaction[] =>
  response.governanceTransactions
    ? response.governanceTransactions.map((transaction: any) => ({
        ...transaction,
        amount: BigNumber.from(transaction.amount),
      }))
    : [];

export const useGovernanceTransactions = () => {
  const contextData = useContext(SubgraphDataContext);

  return {
    transactions: contextData.governanceSubgraphData.transactions,
    loading: contextData.governanceSubgraphData.loading,
  };
};

export default useGovernanceTransactions;
