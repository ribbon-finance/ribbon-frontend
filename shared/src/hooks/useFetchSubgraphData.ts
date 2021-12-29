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
import { supportedChainIds, isProduction } from "../utils/env";
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
  vaultPriceHistoryGraphql,
  resolveVaultPriceHistorySubgraphResponse,
} from "./useVaultPerformanceUpdate";
import { usePendingTransactions } from "./pendingTransactionsContext";

const useFetchSubgraphData = () => {
  const { account: acc } = useWeb3React();
  const account = impersonateAddress || acc;
  const [data, setData] =
    useState<SubgraphDataContextType>(defaultSubgraphData);
  const { transactionsCounter } = usePendingTransactions();
  const [, setMulticallCounter] = useState(0);

  const doMulticall = useCallback(async () => {
    if (!isProduction()) {
      console.time("Subgraph Data Fetch");
    }

    /**
     * We keep track with counter so to make sure we always only update with the latest info
     */
    let currentCounter: number;
    setMulticallCounter((counter) => {
      currentCounter = counter + 1;
      return currentCounter;
    });

    const responsesAcrossVersions = Object.fromEntries(await Promise.all(
      VaultVersionList.map(async (version) => {
        const subgraphResponse = await Promise.all(
          supportedChainIds.map(async (cId) => {
            const response = await axios.post(
              getSubgraphURIForVersion(version, cId),
              {
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
                  ${vaultActivitiesGraphql(version, cId)}
                  ${rbnTokenGraphql(account, version, cId)}
                  ${vaultPriceHistoryGraphql(version, cId)}
                }`.replaceAll(" ", ""),
              }
            );
            return response.data.data;
          })
        );
        return [version, subgraphResponse.reduce((acc,cur)=>({...acc,...cur}))];
      })
    ));

    setMulticallCounter((counter) => {
      if (counter === currentCounter) {
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
          vaultPriceHistory: resolveVaultPriceHistorySubgraphResponse(
            responsesAcrossVersions
          ),
          loading: false,
        }));
      }

      return counter;
    });

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
