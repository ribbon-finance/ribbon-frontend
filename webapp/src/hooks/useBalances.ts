import { useWeb3React } from "@web3-react/core";
import axios from "axios";
import { BigNumber } from "ethers";
import { useCallback, useEffect, useState } from "react";

import { BalanceUpdate } from "shared/lib/models/vault";
import { getSubgraphqlURI } from "shared/lib/utils/env";

const useBalances = (before?: number, after?: number) => {
  const { account } = useWeb3React();
  const [balances, setBalances] = useState<BalanceUpdate[]>([]);
  const [loading, setLoading] = useState(false);

  const loadBalances = useCallback(
    async (acc: string, params: { before?: number; after?: number }) => {
      setLoading(true);
      setBalances(await fetchBalances(acc, params));
      setLoading(false);
    },
    []
  );

  useEffect(() => {
    if (!account) {
      setBalances([]);
      return;
    }

    loadBalances(account, { before, after });
  }, [account, loadBalances, before, after]);

  return { balances, loading };
};

const fetchBalances = async (
  account: string,
  params: { before?: number; after?: number } = {}
): Promise<BalanceUpdate[]> => {
  const response = await axios.post(getSubgraphqlURI(), {
    query: `
        {
          balanceUpdates(
            where: {
              account:"${account}",
              ${params.before ? `timestamp_lte: ${params.before},` : ``}
              ${params.after ? `timestamp_gte: ${params.after},` : ``}
            },
            orderBy: timestamp,
            orderDirection: asc
          ) {
            vault {
              symbol
              name
            }
            timestamp
            balance
            yieldEarned
          }
        }
        `,
  });

  return response.data.data.balanceUpdates.map((item: any) => ({
    ...item,
    balance: BigNumber.from(item.balance),
    yieldEarned: BigNumber.from(item.yieldEarned),
  }));
};

export default useBalances;
