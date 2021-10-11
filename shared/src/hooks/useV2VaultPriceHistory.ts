import { BigNumber } from "@ethersproject/bignumber";
import { useContext } from "react";

import {
  VaultAddressMap,
  VaultList,
  VaultOptions,
  VaultVersion,
} from "../constants/constants";
import { V2VaultPriceHistoriesData } from "../models/vault";
import { SubgraphDataContext } from "./subgraphDataContext";

const getVaultPriceHistoryKey = (vault: VaultOptions) =>
  `vaultPriceHistory_${vault.replace(/-/g, "")}`;

export const v2VaultPriceHistoryGraphql = (version: VaultVersion) => {
  if (version !== "v2") {
    return "";
  }

  return VaultList.reduce((acc, vault) => {
    const vaultAddress = VaultAddressMap[vault][version]?.toLowerCase();

    if (!vaultAddress) {
      return acc;
    }

    return (
      acc +
      `
        ${getVaultPriceHistoryKey(
          vault
        )}: vaultPerformanceUpdates(where: { vault_in: ["${vaultAddress}"] }) {
          pricePerShare
          timestamp
        }
      `
    );
  }, "");
};

export const resolveV2VaultPriceHistorySubgraphResponse = (
  responses: { [vault in VaultVersion]: any | undefined }
): V2VaultPriceHistoriesData =>
  Object.fromEntries(
    VaultList.map((vault) => {
      const priceHistory = responses.v2[getVaultPriceHistoryKey(vault)];

      return [
        vault,
        priceHistory
          ? priceHistory.map(
              (history: { pricePerShare: string; timestamp: number }) => ({
                ...history,
                pricePerShare: BigNumber.from(history.pricePerShare),
              })
            )
          : [],
      ];
    })
  ) as V2VaultPriceHistoriesData;

const useV2VaultPriceHistory = (vaultOption: VaultOptions) => {
  const contextData = useContext(SubgraphDataContext);

  return {
    priceHistory: contextData.v2VaultPriceHistory[vaultOption],
    loading: contextData.loading,
  };
};

export default useV2VaultPriceHistory;
