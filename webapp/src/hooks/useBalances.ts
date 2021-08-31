import { useWeb3React } from "@web3-react/core";
import axios from "axios";
import { BigNumber } from "ethers";
import { useCallback, useEffect, useState } from "react";

import { BalanceUpdate } from "shared/lib/models/vault";
import { impersonateAddress } from "shared/lib/utils/development";
import {
  getSubgraphURIForVersion,
  VaultVersionList,
} from "shared/lib/constants/constants";

const useBalances = (before?: number, after?: number) => {
  const web3Context = useWeb3React();
  const account = impersonateAddress ? impersonateAddress : web3Context.account;
  // TODO: Global state
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
  const responses = Object.fromEntries(
    await Promise.all(
      VaultVersionList.map(async (version) => {
        const response = await axios.post(getSubgraphURIForVersion(version), {
          query: `
          {
            balanceUpdates(
              where: {
                account:"${account}",
                ${params.before ? `timestamp_lte: ${params.before},` : ``}
                ${params.after ? `timestamp_gte: ${params.after},` : ``}
              },
              orderBy: timestamp,
              orderDirection: desc,
              first: 1000
            ) {
              vault {
                symbol
                name
              }
              timestamp
              balance
              yieldEarned
              isWithdraw
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
      ? responses[version].data.data.balanceUpdates
          .reverse()
          .map((item: any) => ({
            ...item,
            balance: BigNumber.from(item.balance),
            yieldEarned: BigNumber.from(item.yieldEarned),
            vaultVersion: version,
          }))
      : []
  );
};

export default useBalances;
