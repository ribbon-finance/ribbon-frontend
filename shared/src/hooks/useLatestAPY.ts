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
import { apyFromPricePerShare } from "../utils/math";

/**
 *
 * @param priceHistory
 * @param periodStart
 * @returns
 */
const getPriceHistoryFromPeriod = (
  priceHistory: VaultPriceHistory[],
  periodStart: Moment
): [VaultPriceHistory, VaultPriceHistory] | undefined => {
  /**
   * Does not procees if price history length is lesser than or equal to 2
   */
  if (priceHistory.length <= 2) {
    /**
     * If only 2 points, return them
     */
    if (priceHistory.length === 2) {
      return [priceHistory[0], priceHistory[1]];
    }

    return undefined;
  }

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
     * If combined length is more than or equals to 2, we simply return the first and second
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
  decimals: number,
  {
    vaultOption,
    vaultVersion,
  }: { vaultOption: VaultOptions; vaultVersion: VaultVersion },
  underlyingYieldAPR: number
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

  let weeksAgo = 0;
  const apys: number[] = [];

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

      // Only includes weeks that is positive
      if (endingPricePerShare > startingPricePerShare) {
        if (weeksAgo > 0) {
          /**
           * Fees and underlying yields had been accounted
           */
          apys.push(
            apyFromPricePerShare(startingPricePerShare, endingPricePerShare) +
              underlyingYieldAPR
          );
        } else {
          switch (vaultVersion) {
            case "v1":
              /**
               * V1 does not have fees that can impact performance
               */
              apys.push(
                apyFromPricePerShare(
                  startingPricePerShare,
                  endingPricePerShare
                ) + underlyingYieldAPR
              );
              break;
            case "v2":
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

              apys.push(
                apyFromPricePerShare(
                  startingPricePerShare,
                  pricePerShareAfterFees
                ) + underlyingYieldAPR
              );
              break;
          }
        }
      }
    }

    // Continue to previous week
    periodStart.subtract(1, "week");
    weeksAgo += 1;

    /**
     * Prevent searching too far ago
     */
    if (weeksAgo >= 4) {
      break;
    }
  }

  // Calculate average apy
  return apys.reduce((acc, curr) => acc + curr, 0) / apys.length || 0;
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

  let underlyingYieldAPR = 0;

  switch (vaultOption) {
    case "ryvUSDC-ETH-P-THETA":
      underlyingYieldAPR = getVaultAPR("yvUSDC", "0.3.0") * 100;
      break;
    case "rstETH-THETA":
      underlyingYieldAPR = lidoAPY * 100;
      break;
  }

  return {
    fetched: !loading,
    res: loading
      ? 0
      : calculateAPYFromPriceHistory(
          priceHistory.map((history) =>
            history.round === round ? { ...history, pricePerShare } : history
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
                        history.round === round
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
