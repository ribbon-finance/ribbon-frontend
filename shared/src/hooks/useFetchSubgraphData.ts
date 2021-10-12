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
import {
  v2VaultPriceHistoryGraphql,
  resolveV2VaultPriceHistorySubgraphResponse,
} from "./useV2VaultPriceHistory";
import { usePendingTransactions } from "./pendingTransactionsContext";

const useFetchSubgraphData = () => {
  const web3Context = useWeb3React();
  const account = impersonateAddress || web3Context.account;
  const [data, setData] =
    useState<SubgraphDataContextType>(defaultSubgraphData);
  const { transactionsCounter } = usePendingTransactions();

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
                ${v2VaultPriceHistoryGraphql(version)}
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
      v2VaultPriceHistory: resolveV2VaultPriceHistorySubgraphResponse(
        responsesAcrossVersions
      ),
      loading: false,
    }));

    if (!isProduction()) {
      console.timeEnd("Subgraph Data Fetch");
    }
  }, [account]);

  useEffect(() => {
    doMulticall();
  }, [doMulticall, transactionsCounter]);

  return data;
};

export default useFetchSubgraphData;
