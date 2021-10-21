import { BigNumber } from "@ethersproject/bignumber";
import { formatUnits } from "@ethersproject/units";
import { useContext, useMemo } from "react";

import {
  getAssets,
  VaultAddressMap,
  VaultList,
  VaultOptions,
  VaultVersion,
  VaultVersionList,
} from "../constants/constants";
import { VaultPriceHistoriesData } from "../models/vault";
import { getAssetDecimals } from "../utils/asset";
import { SubgraphDataContext } from "./subgraphDataContext";

const getVaultPriceHistoryKey = (vault: VaultOptions) =>
  `vaultPriceHistory_${vault.replace(/-/g, "")}`;

export const vaultPriceHistoryGraphql = (version: VaultVersion) => {
  return VaultList.reduce((acc, vault) => {
    const vaultAddress = VaultAddressMap[vault][version]?.toLowerCase();

    if (!vaultAddress) {
      return acc;
    }

    return (
      acc +
      `
        ${getVaultPriceHistoryKey(vault)}: vaultPerformanceUpdates(
          where: { vault_in: ["${vaultAddress}"] },
          orderBy: timestamp,
          orderDirection: desc,
          first: 1000
        ) {
          pricePerShare
          timestamp
        }
      `
    );
  }, "");
};

export const resolveVaultPriceHistorySubgraphResponse = (
  responses: { [vault in VaultVersion]: any | undefined }
): VaultPriceHistoriesData =>
  Object.fromEntries(
    VaultVersionList.map((version) => [
      version,
      Object.fromEntries(
        VaultList.map((vault) => {
          const priceHistory =
            responses[version][getVaultPriceHistoryKey(vault)];

          return [
            vault,
            priceHistory
              ? priceHistory
                  .map(
                    (history: {
                      pricePerShare: string;
                      timestamp: number;
                    }) => ({
                      ...history,
                      pricePerShare: BigNumber.from(history.pricePerShare),
                    })
                  )
                  .reverse()
              : [],
          ];
        })
      ),
    ])
  ) as VaultPriceHistoriesData;

const useVaultPriceHistory = (
  vaultOption: VaultOptions,
  vaultVersion: VaultVersion
) => {
  const contextData = useContext(SubgraphDataContext);

  return {
    priceHistory: contextData.vaultPriceHistory[vaultVersion][vaultOption],
    loading: contextData.loading,
  };
};

export default useVaultPriceHistory;

export const useLatestAPY = (
  vaultOption: VaultOptions,
  vaultVersion: VaultVersion
) => {
  const contextData = useContext(SubgraphDataContext);

  const latestAPY = useMemo(() => {
    const vaultPriceHistory =
      contextData.vaultPriceHistory[vaultVersion][vaultOption];

    /**
     * We try to find the last profitable yield compare to it's previous one,
     * and we annulized the number to get APY
     */
    for (let i = vaultPriceHistory.length - 1; i > 0; i--) {
      const decimals = getAssetDecimals(getAssets(vaultOption));
      const nPrice = parseFloat(
        formatUnits(vaultPriceHistory[i].pricePerShare, decimals)
      );
      const nMinusOnePrice = parseFloat(
        formatUnits(vaultPriceHistory[i - 1].pricePerShare, decimals)
      );

      const annualizedAPY =
        (((nPrice - nMinusOnePrice) / nMinusOnePrice + 1) ** 52 - 1) * 100;

      /**
       * Ignore if the particular data point represent exercised
       */
      if (annualizedAPY > 0) {
        return annualizedAPY;
      }
    }

    return 0;
  }, [contextData.vaultPriceHistory, vaultOption, vaultVersion]);

  return { fetched: !contextData.loading, res: latestAPY };
};

export const useLatestAPYs = () => {
  const contextData = useContext(SubgraphDataContext);

  const latestAPYs = useMemo(
    () =>
      Object.fromEntries(
        VaultVersionList.map((vaultVersion) => [
          vaultVersion,
          Object.fromEntries(
            VaultList.map((vaultOption) => {
              const vaultPriceHistory =
                contextData.vaultPriceHistory[vaultVersion][vaultOption];

              /**
               * We try to find the last profitable yield compare to it's previous one,
               * and we annulized the number to get APY
               */
              for (let i = vaultPriceHistory.length - 1; i > 0; i--) {
                const decimals = getAssetDecimals(getAssets(vaultOption));
                const nPrice = parseFloat(
                  formatUnits(vaultPriceHistory[i].pricePerShare, decimals)
                );
                const nMinusOnePrice = parseFloat(
                  formatUnits(vaultPriceHistory[i - 1].pricePerShare, decimals)
                );

                const annualizedAPY =
                  (((nPrice - nMinusOnePrice) / nMinusOnePrice + 1) ** 52 - 1) *
                  100;

                /**
                 * Ignore if the particular data point represent exercised
                 */
                if (annualizedAPY > 0) {
                  return [vaultOption, annualizedAPY];
                }
              }

              return [vaultOption, 0];
            })
          ),
        ])
      ) as { [version in VaultVersion]: { [option in VaultOptions]: number } },
    [contextData.vaultPriceHistory]
  );

  return { fetched: !contextData.loading, res: latestAPYs };
};
