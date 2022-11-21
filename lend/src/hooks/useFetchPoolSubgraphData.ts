import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import {
  getSubgraphURIForVersion,
  SUBGRAPHS_TO_QUERY,
} from "../constants/constants";

import {
  PoolVersion,
  PoolVersionList,
} from "shared/lib/constants/lendConstants";
import {
  defaultPoolSubgraphData,
  PoolSubgraphDataContextType,
} from "./subgraphDataContext";
import { impersonateAddress } from "shared/lib/utils/development";
import {
  resolvePoolAccountsSubgraphResponse,
  poolAccountsGraphql,
} from "./usePoolAccounts";
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
  resolvePoolActivitiesSubgraphResponse,
  poolActivitiesGraphql,
} from "./usePoolActivity";
import { usePendingTransactions } from "./pendingTransactionsContext";
import { resolvePoolsSubgraphResponse, poolGraphql } from "./usePoolData";
import useWeb3Wallet from "./useWeb3Wallet";

const useFetchPoolSubgraphData = () => {
  const { account: acc } = useWeb3Wallet();
  const account = impersonateAddress || acc;
  const [data, setData] = useState<PoolSubgraphDataContextType>(
    defaultPoolSubgraphData
  );
  const { transactionsCounter } = usePendingTransactions();
  const [, setMulticallCounter] = useState(0);

  const doMulticall = useCallback(async () => {
    if (!isProduction()) {
      console.time("Subgraph Data Fetch"); // eslint-disable-line
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
      SUBGRAPHS_TO_QUERY.map(async ([version, chain]) => {
        const query = `
          query{${
            account
              ? `
                  ${poolAccountsGraphql(account, version)}
                  ${transactionsGraphql(account, chain)}
                  ${balancesGraphql(account, chain)}
                `
              : ""
          }
          ${poolGraphql(version, chain)}
          ${poolActivitiesGraphql(version, chain)}
        }`.replaceAll(" ", "");

        const response = await axios.post(
          getSubgraphURIForVersion(version, chain),
          {
            query,
          }
        );
        return [version, response.data.data];
      })
    );

    // Group all the responses of the same version together
    // Merge them without overriding the previous properties
    const responsesAcrossVersions: Record<PoolVersion, any> =
      Object.fromEntries(
        PoolVersionList.map((version: PoolVersion) => {
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
      ) as Record<PoolVersion, any>;

    setMulticallCounter((counter) => {
      if (counter === currentCounter) {
        setData((prev) => ({
          ...prev,
          pools: resolvePoolsSubgraphResponse(responsesAcrossVersions),
          poolAccounts: resolvePoolAccountsSubgraphResponse(
            responsesAcrossVersions
          ),
          poolActivities: resolvePoolActivitiesSubgraphResponse(
            responsesAcrossVersions
          ),
          balances: resolveBalancesSubgraphResponse(responsesAcrossVersions),
          transactions: resolveTransactionsSubgraphResponse(
            responsesAcrossVersions
          ),
          loading: false,
        }));
      }

      return counter;
    });

    if (!isProduction()) {
      console.timeEnd("Subgraph Data Fetch"); // eslint-disable-line
    }
  }, [account]);

  useEffect(() => {
    doMulticall();
  }, [doMulticall, transactionsCounter]);

  return data;
};

export default useFetchPoolSubgraphData;
