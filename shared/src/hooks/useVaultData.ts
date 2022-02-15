import { BigNumber } from "@ethersproject/bignumber";
import { useContext } from "react";
import {
  VaultAddressMap,
  VaultList,
  VaultOptions,
  VaultVersion,
  VaultVersionList,
} from "../constants/constants";
import { VaultsSubgraphData } from "../models/vault";
import { SubgraphDataContext } from "./subgraphDataContext";

const getVaultKey = (vault: VaultOptions) => `vault_${vault.replace(/-/g, "")}`;

export const vaultGraphql = (version: VaultVersion, chainId: number) =>
  VaultList.reduce((acc, vault) => {
    const vaultAddress = VaultAddressMap[vault][version]?.toLowerCase();

    if (!vaultAddress || VaultAddressMap[vault].chainId !== chainId) {
      return acc;
    }

    return (
      acc +
      `
          ${getVaultKey(vault)}: vault(id: "${vaultAddress}" ){
            id
            name
            symbol
            totalBalance
            totalPremiumEarned
          }

        `
    );
  }, "");

export const resolveVaultsSubgraphResponse = (responses: {
  [version in VaultVersion]: any | undefined;
}): VaultsSubgraphData =>
  Object.fromEntries(
    VaultVersionList.map((version) => [
      version,
      Object.fromEntries(
        VaultList.map((vault) => {
          const vaultData = responses[version]
            ? responses[version][getVaultKey(vault)]
            : undefined;

          return [
            vault,
            vaultData
              ? {
                  ...vaultData,
                  totalBalance: BigNumber.from(vaultData.totalBalance),
                }
              : undefined,
          ];
        })
      ),
    ])
  ) as VaultsSubgraphData;

export const useVaultsSubgraphData = () => {
  const contextData = useContext(SubgraphDataContext);

  return {
    data: contextData.vaultSubgraphData.vaults,
    loading: contextData.vaultSubgraphData.loading,
  };
};
