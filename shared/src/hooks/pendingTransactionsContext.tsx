import { Web3Provider } from "@ethersproject/providers";
import React, {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useGlobalState } from "../store/store";
import { PendingTransaction } from "../store/types";
import { isEVMChain, isSolanaChain } from "../utils/chains";
import { useChain } from "./chainContext";
import { useConnection } from "@solana/wallet-adapter-react";
import { useFlexVault } from "./useFlexVault";
import { Web3ReactProvider } from "@web3-react/core";
import { allConnectors } from "../utils/wallet/connectors";
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
  // const { ethereumProvider } = useWeb3Wallet();
  const [chain] = useChain();
  const { update } = useFlexVault();
  const { connection } = useConnection();
  const { provider } = useWeb3Context();
  /**
   * Keep track with first confirmation
   */
  useEffect(() => {
    pendingTransactions.forEach(async (transaction) => {
      if (!transaction.status) {
        let receipt: any;
        if (isEVMChain(chain)) {
          receipt = await (provider as Web3Provider).waitForTransaction(
            transaction.txhash,
            2
          );
        } else if (isSolanaChain(chain)) {
          receipt = await connection.confirmTransaction(
            transaction.txhash,
            "confirmed"
          );
        }

        const getTransactionStatus = () => {
          if (isEVMChain(chain)) {
            return receipt.status ? "success" : "error";
          } else if (isSolanaChain(chain)) {
            return receipt.value.err ? "error" : "success";
          }
        };

        setTransactionsCounter((counter) => counter + 1);
        setPendingTransactions((pendingTransactions) =>
          pendingTransactions.map((_transaction) => {
            if (_transaction.txhash !== transaction.txhash) {
              return _transaction;
            }
            const pendingTx: PendingTransaction = {
              ..._transaction,
              status: getTransactionStatus(),
            };
            return pendingTx;
          })
        );

        if (isSolanaChain(chain)) update();
      }
    }, []);
  }, [
    chain,
    connection,
    update,
    pendingTransactions,
    setPendingTransactions,
    provider,
  ]);

  return (
    <Web3ReactProvider connectors={allConnectors}>
      <PendingTransactionsContext.Provider
        value={{
          pendingTransactions,
          transactionsCounter,
        }}
      >
        {children}
      </PendingTransactionsContext.Provider>
    </Web3ReactProvider>
  );
};
