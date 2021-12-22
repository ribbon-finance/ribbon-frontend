import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useWeb3React } from "@web3-react/core";
import {
  getSubgraphqlURI,
} from "shared/lib/utils/env";
import {
  VaultVersionList,
} from "../constants/constants";
import {
  defaultSubgraphData,
  SubgraphDataContextType,
} from "./subgraphDataContext";
import { impersonateAddress } from "shared/lib/utils/development";
import {
  resolveVaultAccountsSubgraphResponse,
  vaultAccountsGraphql,
} from "./useVaultAccounts";
import { isProduction } from "shared/lib/utils/env";
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
} from "shared/lib/hooks/useRBNTokenSubgraph";
import {
  vaultPriceHistoryGraphql,
  resolveVaultPriceHistorySubgraphResponse,
} from "./useVaultPerformanceUpdate";
import { usePendingTransactions } from "./pendingTransactionsContext";

const useFetchSubgraphData = () => {
  const web3Context = useWeb3React();
  const account = isProduction()
    ? impersonateAddress || web3Context.account
    : "0xb793898783802543D17FcCd78BE611241501649d";

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
          if (version === "v1") {
            return [version, {}];
          }

          const response = await axios.post(getSubgraphqlURI(), {
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
                ${vaultPriceHistoryGraphql(version)}
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
      vaultPriceHistory: resolveVaultPriceHistorySubgraphResponse(
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
