import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useWeb3React } from "@web3-react/core";

import {
  getSubgraphURIForVersion,
  VaultVersionList,
} from "../constants/constants";
import {
  defaultSubgraphData,
  SubgraphDataContextType,
} from "./subgraphDataContext";
import { impersonateAddress } from "../utils/development";
import {
  resolveVaultAccountsSubgraphResponse,
  vaultAccountsGraphql,
} from "./useVaultAccounts";
import { isProduction } from "../utils/env";
import {
  resolveTransactionsSubgraphResponse,
  transactionsGraphql,
} from "./useTransactions";
import {
  balancesGraphql,
  resolveBalancesSubgraphResponse,
} from "./useBalances";
import {
  resolveVaultActivitiesSubgraphResponse,
  vaultActivitiesGraphql,
} from "./useVaultActivity";
import {
  rbnTokenGraphql,
  resolveRBNTokenAccountSubgraphResponse,
  resolveRBNTokenSubgraphResponse,
} from "./useRBNTokenSubgraph";

const useFetchSubgraphData = (
  {
    poll,
    pollingFrequency,
  }: {
    poll: boolean;
    pollingFrequency: number;
  } = { poll: true, pollingFrequency: 8000 }
) => {
  const web3Context = useWeb3React();
  const account = impersonateAddress || web3Context.account;
  const [data, setData] =
    useState<SubgraphDataContextType>(defaultSubgraphData);

  const doMulticall = useCallback(async () => {
    if (!isProduction()) {
      console.time("Subgraph Data Fetch");
    }

    const responsesAcrossVersions = Object.fromEntries(
      await Promise.all(
        VaultVersionList.map(async (version) => {
          const response = await axios.post(getSubgraphURIForVersion(version), {
            query: `{
                ${
                  account
                    ? `
                        ${vaultAccountsGraphql(account, version)}
                        ${transactionsGraphql(account, version)}
                        ${balancesGraphql(account, version)}
                      `
                    : ""
                }
                ${vaultActivitiesGraphql(version)}
                ${rbnTokenGraphql(account, version)}
              }`.replaceAll(" ", ""),
          });

          return [version, response.data.data];
        })
      )
    );

    setData((prev) => ({
      ...prev,
      vaultAccounts: resolveVaultAccountsSubgraphResponse(
        responsesAcrossVersions
      ),
      vaultActivities: resolveVaultActivitiesSubgraphResponse(
        responsesAcrossVersions
      ),
      balances: resolveBalancesSubgraphResponse(responsesAcrossVersions),
      transactions: resolveTransactionsSubgraphResponse(
        responsesAcrossVersions
      ),
      rbnToken: resolveRBNTokenSubgraphResponse(responsesAcrossVersions),
      rbnTokenAccount: resolveRBNTokenAccountSubgraphResponse(
        responsesAcrossVersions
      ),
      loading: false,
    }));

    if (!isProduction()) {
      console.timeEnd("Subgraph Data Fetch");
    }
  }, [account]);

  useEffect(() => {
    // eslint-disable-next-line no-undef
    let pollInterval: NodeJS.Timeout | null = null;
    doMulticall();

    if (poll) {
      pollInterval = setInterval(doMulticall, pollingFrequency);
    }

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [doMulticall, poll, pollingFrequency]);

  return data;
};

export default useFetchSubgraphData;
