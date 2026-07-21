import { Web3Provider } from "@ethersproject/providers";
import { useConnection } from "@solana/wallet-adapter-react";
import React, { ReactElement, useEffect, useState } from "react";

import { useGlobalState } from "../store/store";
import { PendingTransaction } from "../store/types";
import { isEVMChain, isSolanaChain } from "../utils/chains";
import { useChain } from "./chainContext";
import { PendingTransactionsContext } from "./pendingTransactionsContext";
import { useFlexVault } from "./useFlexVault";
import { useWeb3Context } from "./web3Context";

export const PendingTransactionsContextProvider: React.FC<{
  children: ReactElement;
}> = ({ children }) => {
  const [pendingTransactions, setPendingTransactions] = useGlobalState(
    "pendingTransactions"
  );
  const [transactionsCounter, setTransactionsCounter] = useState(0);
  const [chain] = useChain();
  const { update } = useFlexVault(isSolanaChain(chain));
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
