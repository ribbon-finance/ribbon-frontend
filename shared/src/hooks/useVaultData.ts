import { BigNumber } from "@ethersproject/bignumber";
import { useContext } from "react";
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
import { VaultsSubgraphData } from "../models/vault";
import { isEVMChain } from "../utils/chains";
import { SubgraphDataContext } from "./subgraphDataContext";

const getVaultKey = (vault: VaultOptions) => `vault_${vault.replace(/-/g, "")}`;

export const vaultGraphql = (version: VaultVersion, chain: Chains) =>
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
