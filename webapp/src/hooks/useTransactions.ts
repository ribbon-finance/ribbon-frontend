import { useCallback, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import axios from "axios";
import { BigNumber } from "ethers";

import { VaultTransaction } from "shared/lib/models/vault";
import { impersonateAddress } from "shared/lib/utils/development";
import {
  getSubgraphURIForVersion,
  VaultVersionList,
} from "shared/lib/constants/constants";

const useTransactions = () => {
  const web3Context = useWeb3React();
  const account = impersonateAddress ? impersonateAddress : web3Context.account;
  // TODO: Global state
  const [transactions, setTransactions] = useState<VaultTransaction[]>([]);
  const [loading, setLoading] = useState(false);

  const loadTransactions = useCallback(async (acc: string) => {
    setLoading(true);
    setTransactions(await fetchTransactions(acc));
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!account) {
      setTransactions([]);
      return;
    }

    loadTransactions(account);
  }, [account, loadTransactions]);

  return { transactions, loading };
};

const fetchTransactions = async (
  account: string
): Promise<VaultTransaction[]> => {
  const responses = Object.fromEntries(
    await Promise.all(
      VaultVersionList.map(async (version) => {
        const response = await axios.post(getSubgraphURIForVersion(version), {
          query: `
          {
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
          }
          `,
        });

        return [version, response];
      })
    )
  );

  return Object.keys(responses).flatMap((version) =>
    responses[version].data.data
      ? responses[version].data.data.vaultTransactions.map(
          (transaction: any) => ({
            ...transaction,
            amount: BigNumber.from(transaction.amount),
            underlyingAmount: BigNumber.from(transaction.underlyingAmount),
            vaultVersion: version,
          })
        )
      : []
  );
};

export default useTransactions;
