import { useWeb3React } from "@web3-react/core";
import React, {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useGlobalState } from "../store/store";
import { PendingTransaction } from "../store/types";
import { useWeb3Context } from "./web3Context";

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

export const PendingTransactionsContextProvider: React.FC<{
  children: ReactElement;
}> = ({ children }) => {
  const [pendingTransactions, setPendingTransactions] = useGlobalState(
    "pendingTransactions"
  );
  const [transactionsCounter, setTransactionsCounter] = useState(0);
  const { library } = useWeb3React();

  /**
   * Keep track with first confirmation
   */
  useEffect(() => {
    pendingTransactions.forEach(async (transaction) => {
      if (!transaction.status) {
        const receipt = await library.waitForTransaction(transaction.txhash, 5);
        setTransactionsCounter((counter) => counter + 1);
        setPendingTransactions((pendingTransactions) =>
          pendingTransactions.map((_transaction) => {
            if (_transaction.txhash !== transaction.txhash) {
              return _transaction;
            }

            return {
              ..._transaction,
              firstConfirmation: true,
              status: receipt.status ? "success" : "error",
            };
          })
        );
      }
    }, []);
  }, [pendingTransactions, library, setPendingTransactions]);

  return (
    <PendingTransactionsContext.Provider
      value={{
        pendingTransactions,
        transactionsCounter,
      }}
    >
      {children}
    </PendingTransactionsContext.Provider>
  );
};
