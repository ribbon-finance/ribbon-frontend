import { useMemo } from "react";
import moment, { Moment } from "moment";
import { formatUnits } from "@ethersproject/units";

import {
  getAssets,
  VaultList,
  VaultOptions,
  VaultVersion,
  VaultVersionList,
} from "../constants/constants";
import useVaultPriceHistory, {
  useVaultsPriceHistory,
} from "./useVaultPerformanceUpdate";
import { VaultPriceHistory } from "../models/vault";
import { getAssetDecimals } from "../utils/asset";

const getPriceHistoryFromPeriod = (
  priceHistory: VaultPriceHistory[],
  periodStart: Moment
): [VaultPriceHistory, VaultPriceHistory] | undefined => {
  const [periodStartTimestamp, periodEndTimestamp, nextPeriodEndTimestamp] = [
    periodStart.unix(),
    periodStart.clone().add(1, "week").unix(),
    periodStart.clone().add(2, "week").unix(),
  ];

  const priceHistoryInPeriod = priceHistory.filter(
    (historyItem) =>
      historyItem.timestamp >= periodStartTimestamp &&
      historyItem.timestamp < periodEndTimestamp
  );
  const priceHistoryInNextPeriod = priceHistory.filter(
    (historyItem) =>
      historyItem.timestamp >= periodEndTimestamp &&
      historyItem.timestamp < nextPeriodEndTimestamp
  );

  /**
   * Check if one of the period is empty
   */
  if (!priceHistoryInPeriod.length || !priceHistoryInNextPeriod.length) {
    /**
     * If combined length is more than 2, we simply return the first and second
     */
    if (priceHistoryInPeriod.length + priceHistoryInNextPeriod.length >= 2) {
      const combinedPriceHistory = [
        ...priceHistoryInPeriod,
        ...priceHistoryInNextPeriod,
      ];
      return [combinedPriceHistory[0], combinedPriceHistory[1]];
    }

    /**
     * Else, return undefined
     */
    return undefined;
  }

  return [priceHistoryInPeriod[0], priceHistoryInNextPeriod[0]];
};

/**
 * To calculate APY, we first find a week that has not been exercised.
 * This is to remove accounting of losses into calculating APY.
 * The calculation shall be calculated based on the start of previous period versus the the start of current period.
 * Each period consist of a week, starting from a friday UTC 10am until the next friday UTC 10am.
 */
export const calculateAPYFromPriceHistory = (
  priceHistory: VaultPriceHistory[],
  decimals: number
) => {
  const periodStart = moment()
    .isoWeekday("friday")
    .utc()
    .set("hour", 10)
    .set("minute", 0)
    .set("second", 0)
    .set("millisecond", 0);

  if (periodStart.isAfter(moment())) {
    periodStart.subtract(1, "week");
  }
  /**
   * Subtract 1 week so that calculation account for fees as well
   */
  periodStart.subtract(1, "week");

  while (true) {
    const priceHistoryFromPeriod = getPriceHistoryFromPeriod(
      priceHistory,
      periodStart
    );

    if (!priceHistoryFromPeriod) {
      return 0;
    }

    const [startingPricePerShare, endingPricePerShare] = [
      parseFloat(
        formatUnits(priceHistoryFromPeriod[0].pricePerShare, decimals)
      ),
      parseFloat(
        formatUnits(priceHistoryFromPeriod[1].pricePerShare, decimals)
      ),
    ];

    /**
     * If the given period is profitable, we calculate APY
     */
    if (endingPricePerShare > startingPricePerShare) {
      return (
        ((1 +
          (endingPricePerShare - startingPricePerShare) /
            startingPricePerShare) **
          52 -
          1) *
        100
      );
    }

    /**
     * Otherwise, we look for the previous week
     */
    periodStart.subtract(1, "week");
  }
};

export const useLatestAPY = (
  vaultOption: VaultOptions,
  vaultVersion: VaultVersion
) => {
  const { priceHistory, loading } = useVaultPriceHistory(
    vaultOption,
    vaultVersion
  );

  switch (vaultVersion) {
    case "v2":
      switch (vaultOption) {
        /**
         * TODO: Temporary hardcode their APY as their subgraph vault performance are being resolved
         */
        case "rAAVE-THETA":
          /**
           * Notes: Related to overcharging issue
           * AAVE Vault pricePerShare issue should automatically be resolved on 10th Dec where the APY will interpolate based on the duration from 3rd Dec to 10th Dec
           */
          return { fetched: true, res: 8.8334241 };
        case "rstETH-THETA":
          return { fetched: true, res: 12.1910215 };
      }
  }

  return {
    fetched: !loading,
    res: loading
      ? 0
      : calculateAPYFromPriceHistory(
          priceHistory,
          getAssetDecimals(getAssets(vaultOption))
        ),
  };
};

export default useLatestAPY;

export const useLatestAPYs = () => {
  const { data, loading } = useVaultsPriceHistory();

  const latestAPYs = useMemo(
    () =>
      Object.fromEntries(
        VaultVersionList.map((version) => [
          version,
          Object.fromEntries(
            VaultList.map((vaultOption) => {
              const priceHistory = data[version][vaultOption];

              switch (version) {
                case "v2":
                  switch (vaultOption) {
                    /**
                     * TODO: Temporary hardcode their APY as their subgraph vault performance are being resolved
                     */
                    case "rAAVE-THETA":
                      /**
                       * Notes: Related to overcharging issue
                       * AAVE Vault pricePerShare issue should automatically be resolved on 10th Dec where the APY will interpolate based on the duration from 3rd Dec to 10th Dec
                       */
                      return [vaultOption, 8.8334241];
                    case "rstETH-THETA":
                      return [vaultOption, 12.1910215];
                  }
              }

              return [
                vaultOption,
                loading
                  ? 0
                  : calculateAPYFromPriceHistory(
                      priceHistory,
                      getAssetDecimals(getAssets(vaultOption))
                    ),
              ];
            })
          ),
        ])
      ) as {
        [version in VaultVersion]: {
          [option in VaultOptions]: number;
        };
      },
    [data, loading]
  );

  return { fetched: !loading, res: latestAPYs };
};
