import { useMemo } from "react";
import moment, { Moment } from "moment";
import { formatUnits } from "@ethersproject/units";

import {
  getAssets,
  VaultFees,
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
import useYearnAPIData from "./useYearnAPIData";
import useLidoAPY from "./useLidoOracle";
import { useV2VaultData, useV2VaultsData } from "./web3DataContext";

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
 * We return [n-1 round price history, n round price history]
 * @param priceHistory Price history objects
 * @param round Round number in question
 * @returns 2 price point for calculating APY, or undefined
 */
const getPriceHistoryFromRound = (
  priceHistory: VaultPriceHistory[],
  round: number
): [VaultPriceHistory, VaultPriceHistory] | undefined => {
  const currRoundPriceHistory = priceHistory.find(
    (history) => history.round === round
  );
  const prevRoundPriceHistory = priceHistory.find(
    (history) => history.round === round - 1
  );

  if (!currRoundPriceHistory || !prevRoundPriceHistory) {
    return undefined;
  }

  return [prevRoundPriceHistory, currRoundPriceHistory];
};

/**
 * To calculate APY, we first find a week that has not been exercised.
 * This is to remove accounting of losses into calculating APY.
 * The calculation shall be calculated based on the start of previous period versus the the start of current period.
 * Each period consist of a week, starting from a friday UTC 10am until the next friday UTC 10am.
 */
export const calculateAPYFromPriceHistory = (
  priceHistory: VaultPriceHistory[],
  decimals: number,
  {
    vaultOption,
    vaultVersion,
  }: { vaultOption: VaultOptions; vaultVersion: VaultVersion },
  underlyingYieldAPR: number
) => {
  switch (vaultVersion) {
    case "v1":
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

      let weeksAgo = 0;

      while (true) {
        const priceHistoryFromPeriod = getPriceHistoryFromPeriod(
          priceHistory,
          periodStart
        );

        if (priceHistoryFromPeriod) {
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
            if (weeksAgo > 0) {
              /**
               * Fees and underlying yields had been accounted
               */
              return (
                ((1 +
                  (endingPricePerShare - startingPricePerShare) /
                    startingPricePerShare) **
                  52 -
                  1) *
                100
              );
            }

            return (
              ((1 +
                (endingPricePerShare - startingPricePerShare) /
                  startingPricePerShare) **
                52 -
                1) *
                100 +
              underlyingYieldAPR
            );
          }
        }

        /**
         * Otherwise, we look for the previous week
         */
        periodStart.subtract(1, "week");
        weeksAgo += 1;

        /**
         * Prevent searching too far ago
         */
        if (weeksAgo >= 5) {
          return 0;
        }
      }
    default:
      let biggestRound = priceHistory[0]?.round || 0;

      priceHistory.forEach((history) => {
        if (history.round && history.round > biggestRound) {
          biggestRound = history.round;
        }
      });

      if (biggestRound <= 0) {
        return 0;
      }

      let currRound = biggestRound;

      while (true) {
        const priceHistoryFromPeriod = getPriceHistoryFromRound(
          priceHistory,
          currRound
        );

        if (priceHistoryFromPeriod) {
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
            if (currRound !== biggestRound) {
              /**
               * Fees and underlying yields had been accounted
               */
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
             * We first calculate price per share after annualized management fees are charged
             */
            const endingPricePerShareAfterManagementFees =
              endingPricePerShare *
              (1 -
                parseFloat(VaultFees[vaultOption].v2?.managementFee!) /
                  100 /
                  52);
            /**
             * Next, we calculate how much performance fees will lower the pricePerShare
             */
            const performanceFeesImpact =
              (endingPricePerShare - startingPricePerShare) *
              (parseFloat(VaultFees[vaultOption].v2?.performanceFee!) / 100);
            /**
             * Finally, we calculate price per share after both fees
             */
            const pricePerShareAfterFees =
              endingPricePerShareAfterManagementFees - performanceFeesImpact;

            return (
              ((1 +
                (pricePerShareAfterFees - startingPricePerShare) /
                  startingPricePerShare) **
                52 -
                1) *
                100 +
              underlyingYieldAPR
            );
          }
        }

        currRound -= 1;

        /**
         * Prevent searching too far ago
         */
        if (currRound <= 1) {
          return 0;
        }
      }
  }
};

export const useLatestAPY = (
  vaultOption: VaultOptions,
  vaultVersion: VaultVersion
) => {
  const { priceHistory, loading: vaultPriceHistoryLoading } =
    useVaultPriceHistory(vaultOption, vaultVersion);
  const {
    data: { round, pricePerShare },
    loading: vaultDataLoading,
  } = useV2VaultData(vaultOption);
  const loading = vaultPriceHistoryLoading || vaultDataLoading;
  const { getVaultAPR } = useYearnAPIData();
  const lidoAPY = useLidoAPY();

  switch (vaultVersion) {
    case "v2":
      switch (vaultOption) {
      }
  }

  let underlyingYieldAPR = 0;

  switch (vaultOption) {
    case "ryvUSDC-ETH-P-THETA":
      underlyingYieldAPR = getVaultAPR("yvUSDC", "0.3.0") * 100;
      break;
    case "rstETH-THETA":
      underlyingYieldAPR = lidoAPY * 100;
  }

  return {
    fetched: !loading,
    res: loading
      ? 0
      : calculateAPYFromPriceHistory(
          priceHistory.map((history) =>
            history.round === round && pricePerShare.gte(history.pricePerShare)
              ? { ...history, pricePerShare }
              : history
          ),
          getAssetDecimals(getAssets(vaultOption)),
          { vaultOption, vaultVersion },
          underlyingYieldAPR
        ),
  };
};

export default useLatestAPY;

export const useLatestAPYs = () => {
  const { data: vaultsPriceHistory, loading: vaultsPriceHistoryLoading } =
    useVaultsPriceHistory();
  const { data: vaultsData, loading: vaultsDataLoading } = useV2VaultsData();
  const loading = vaultsPriceHistoryLoading || vaultsDataLoading;
  const { getVaultAPR } = useYearnAPIData();
  const lidoAPY = useLidoAPY();

  const latestAPYs = useMemo(
    () =>
      Object.fromEntries(
        VaultVersionList.map((version) => [
          version,
          Object.fromEntries(
            VaultList.map((vaultOption) => {
              const priceHistory = vaultsPriceHistory[version][vaultOption];
              const { round, pricePerShare } = vaultsData[vaultOption];

              switch (version) {
                case "v2":
                  switch (vaultOption) {
                  }
              }

              let underlyingYieldAPR = 0;

              switch (vaultOption) {
                case "ryvUSDC-ETH-P-THETA":
                  underlyingYieldAPR = getVaultAPR("yvUSDC", "0.3.0") * 100;
                  break;
                case "rstETH-THETA":
                  underlyingYieldAPR = lidoAPY * 100;
              }

              return [
                vaultOption,
                loading
                  ? 0
                  : calculateAPYFromPriceHistory(
                      priceHistory.map((history) =>
                        history.round === round &&
                        pricePerShare.gte(history.pricePerShare)
                          ? { ...history, pricePerShare }
                          : history
                      ),
                      getAssetDecimals(getAssets(vaultOption)),
                      { vaultOption, vaultVersion: version },
                      underlyingYieldAPR
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
    [vaultsData, vaultsPriceHistory, getVaultAPR, lidoAPY, loading]
  );

  return { fetched: !loading, res: latestAPYs };
};
