import { BigNumber } from "@ethersproject/bignumber";
import { useContext } from "react";

import {
  VaultAddressMap,
  VaultList,
  VaultOptions,
  VaultVersion,
  VaultVersionList,
} from "../constants/constants";
import { VaultPriceHistoriesData } from "../models/vault";
import { SubgraphDataContext } from "./subgraphDataContext";

const getVaultPriceHistoryKey = (vault: VaultOptions) =>
  `vaultPriceHistory_${vault.replace(/-/g, "")}`;

export const vaultPriceHistoryGraphql = (
  version: VaultVersion,
  chainId: number
) => {
  return VaultList.reduce((acc, vault) => {
    const vaultAddress = VaultAddressMap[vault][version]?.toLowerCase();

    if (!vaultAddress || VaultAddressMap[vault].chainId !== chainId) {
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
          ${version !== "v1" ? "round" : ""}
        }
      `
    );
  }, "");
};

export const resolveVaultPriceHistorySubgraphResponse = (responses: {
  [version in VaultVersion]: any | undefined;
}): VaultPriceHistoriesData =>
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
                      round: number;
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
    priceHistory:
      contextData.vaultSubgraphData.vaultPriceHistory[vaultVersion][
        vaultOption
      ],
    loading: contextData.vaultSubgraphData.loading,
  };
};

export const useVaultsPriceHistory = () => {
  const contextData = useContext(SubgraphDataContext);
  return {
    data: contextData.vaultSubgraphData.vaultPriceHistory,
    loading: contextData.vaultSubgraphData.loading,
  };
};

export default useVaultPriceHistory;
