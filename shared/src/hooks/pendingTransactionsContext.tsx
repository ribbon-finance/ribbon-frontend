import React, { useCallback, useContext } from "react";

import { useGlobalState } from "../store/store";
import { PendingTransaction } from "../store/types";

export type PendingTransactionsContextType = {
  pendingTransactions: PendingTransaction[];
  transactionsCounter: number;
};

export const PendingTransactionsContext =
  React.createContext<PendingTransactionsContextType>({
    pendingTransactions: [],
    transactionsCounter: 0,
  });

export const usePendingTransactions = () => {
  const [, setPendingTransactions] = useGlobalState("pendingTransactions");
  const context = useContext(PendingTransactionsContext);

  const addPendingTransaction = useCallback(
    (transaction: PendingTransaction) => {
      setPendingTransactions((pendingTransactions) => [
        ...pendingTransactions,
        transaction,
      ]);
    },
    [setPendingTransactions]
  );

  return { ...context, addPendingTransaction };
};
