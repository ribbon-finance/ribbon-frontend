import { useContext } from "react";
import { BigNumber } from "ethers";

import {
  Chains,
  CHAINS_TO_ID,
  isSolanaVault,
  VaultAddressMap,
  VaultList,
  VaultOptions,
  VaultVersion,
  VaultVersionList,
} from "../constants/constants";
import { VaultActivitiesData } from "../models/vault";
import { SubgraphDataContext } from "./subgraphDataContext";
import { isEVMChain, isSolanaChain } from "../utils/chains";

const getVaultActivityKey = (
  vault: VaultOptions,
  type: "shortPositions" | "optionTrades"
) => `vaultActivity_${type}_${vault.replace(/-/g, "")}`;

export const vaultActivitiesGraphql = (version: VaultVersion, chain: Chains) =>
  VaultList.reduce((acc, vault) => {
    let vaultAddress = VaultAddressMap[vault][version];

    if (
      !isSolanaVault(vault) &&
      (!vaultAddress || VaultAddressMap[vault].chainId !== CHAINS_TO_ID[chain])
    ) {
      return acc;
    }

    if (isEVMChain(chain)) {
      vaultAddress = vaultAddress?.toLowerCase();
    }

    return (
      acc +
      `
          ${getVaultActivityKey(vault, "shortPositions")}:
          vaultShortPositions
          ${
            isSolanaChain(chain)
              ? `(where: { vaultId: {_in: ["${vaultAddress}"] }})`
              : `(where: { vault_in: ["${vaultAddress}"] })`
          }
          {
            id
            depositAmount
            mintAmount
            strikePrice
            openedAt
            openTxhash
            expiry
          }

          ${getVaultActivityKey(vault, "optionTrades")}:
          vaultOptionTrades ${
            isSolanaChain(chain)
              ? `(where: { vaultId: {_in: ["${vaultAddress}"] }})`
              : `(where: { vault_in: ["${vaultAddress}"] })`
          }
          {
            vaultShortPosition {
              id
              strikePrice
              expiry
            }
            sellAmount
            premium
            timestamp
            txhash
          }
        `
    );
  }, "");

export const resolveVaultActivitiesSubgraphResponse = (responses: {
  [version in VaultVersion]: any | undefined;
}): VaultActivitiesData =>
  Object.fromEntries(
    VaultVersionList.map((version) => [
      version,
      Object.fromEntries(
        VaultList.map((vault) => {
          const shortPositionsData = responses[version]
            ? responses[version][
                getVaultActivityKey(vault, "shortPositions")
              ] || []
            : [];
          const optionTradesData = responses[version]
            ? responses[version][getVaultActivityKey(vault, "optionTrades")] ||
              []
            : [];

          return [
            vault,
            [
              ...shortPositionsData.map((item: any) => ({
                ...item,
                depositAmount: BigNumber.from(item.depositAmount),
                mintAmount: BigNumber.from(item.mintAmount),
                strikePrice: BigNumber.from(item.strikePrice),
                date: new Date(item.openedAt * 1000),
                type: "minting",
              })),
              ...optionTradesData.map((item: any) => ({
                ...item,
                vaultShortPosition: {
                  ...item.vaultShortPosition,
                  strikePrice: BigNumber.from(
                    item.vaultShortPosition.strikePrice
                  ),
                },
                sellAmount: BigNumber.from(item.sellAmount),
                premium: BigNumber.from(item.premium),
                date: new Date(item.timestamp * 1000),
                type: "sales",
              })),
            ],
          ];
        })
      ),
    ])
  ) as VaultActivitiesData;

export const useAllVaultActivities = () => {
  const contextData = useContext(SubgraphDataContext);

  return {
    activities: contextData.vaultSubgraphData.vaultActivities,
    loading: contextData.vaultSubgraphData.loading,
  };
};

const useVaultActivity = (
  vault: VaultOptions,
  vaultVersion: VaultVersion = "v1"
) => {
  const contextData = useContext(SubgraphDataContext);

  return {
    activities:
      contextData.vaultSubgraphData.vaultActivities[vaultVersion][vault],
    loading: contextData.vaultSubgraphData.loading,
  };
};

export default useVaultActivity;
