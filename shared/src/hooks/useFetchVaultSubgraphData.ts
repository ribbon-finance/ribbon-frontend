import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useWeb3React } from "@web3-react/core";

import {
  getSubgraphURIForVersion,
  SUBGRAPHS_TO_QUERY,
  VaultVersion,
  VaultVersionList,
} from "../constants/constants";
import {
  defaultVaultSubgraphData,
  VaultSubgraphDataContextType,
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
  vaultPriceHistoryGraphql,
  resolveVaultPriceHistorySubgraphResponse,
} from "./useVaultPerformanceUpdate";
import { usePendingTransactions } from "./pendingTransactionsContext";
import { resolveVaultsSubgraphResponse, vaultGraphql } from "./useVaultData";
import {
  liquidityMiningPoolGraphql,
  resolveLiquidityMiningPoolsSubgraphResponse,
} from "./useLiquidityMiningPools";
import {
  liquidityMiningPoolAccountsGraphql,
  resolveLiquidityMiningPoolAccountsSubgraphResponse,
} from "./useLiquidityMiningPoolAccounts";

const useFetchVaultSubgraphData = () => {
  const { account: acc } = useWeb3React();
  const account = impersonateAddress || acc;
  const [data, setData] = useState<VaultSubgraphDataContextType>(
    defaultVaultSubgraphData
  );
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

      setData((prev) => ({
        ...prev,
        loading: true,
      }));

      return currentCounter;
    });

    const allSubgraphResponses = await Promise.all(
      SUBGRAPHS_TO_QUERY.map(async ([version, chainId]) => {
        const response = await axios.post(
          getSubgraphURIForVersion(version, chainId),
          {
            query: `{
                ${
                  account
                    ? `
                        ${vaultAccountsGraphql(account, version)}
                        ${transactionsGraphql(account)}
                        ${balancesGraphql(account)}
                        ${liquidityMiningPoolAccountsGraphql(account, version)}
                      `
                    : ""
                }
                ${vaultGraphql(version, chainId)}
                ${vaultActivitiesGraphql(version, chainId)}
                ${vaultPriceHistoryGraphql(version, chainId)}
                ${liquidityMiningPoolGraphql(version, chainId)}
              }`.replaceAll(" ", ""),
          }
        );
        return [version, response.data.data];
      })
    );

    // Group all the responses of the same version together
    // Merge them without overriding the previous properties
    const responsesAcrossVersions: Record<VaultVersion, any> =
      Object.fromEntries(
        VaultVersionList.map((version: VaultVersion) => {
          const mergedResponse: any = {};

          const responsesForVersion = allSubgraphResponses
            .filter(([resVersion, _]) => resVersion === version)
            .map(([_, res]) => res);

          responsesForVersion.forEach((response: any) => {
            if (response) {
              Object.keys(response).forEach((key: string) => {
                // Push response if its an array
                // Otherwise merge without overriding existing property
                if (!mergedResponse[key]) {
                  mergedResponse[key] = response[key];
                } else if (
                  Array.isArray(mergedResponse[key]) &&
                  Array.isArray(response[key])
                ) {
                  mergedResponse[key].push(...response[key]);
                }
              });
            }
          });
          return [version, mergedResponse];
        })
      ) as Record<VaultVersion, any>;

    setMulticallCounter((counter) => {
      if (counter === currentCounter) {
        setData((prev) => ({
          ...prev,
          vaults: resolveVaultsSubgraphResponse(responsesAcrossVersions),
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
          vaultPriceHistory: resolveVaultPriceHistorySubgraphResponse(
            responsesAcrossVersions
          ),
          stakingPools: {
            lm: resolveLiquidityMiningPoolsSubgraphResponse(
              responsesAcrossVersions
            ),
          },
          stakingAccounts: {
            lm: resolveLiquidityMiningPoolAccountsSubgraphResponse(
              responsesAcrossVersions
            ),
          },
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

export default useFetchVaultSubgraphData;
