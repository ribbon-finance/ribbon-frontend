import { useContext } from "react";
import { BigNumber } from "ethers";

import {
  Chains,
  VaultAddressMap,
  VaultList,
  VaultOptions,
  VaultVersion,
  VaultVersionList,
} from "../constants/constants";
import { VaultActivitiesData } from "../models/vault";
import { SubgraphDataContext } from "./subgraphDataContext";
import { isEVMChain } from "../utils/chains";

const getVaultActivityKey = (
  vault: VaultOptions,
  type: "vaultBorrows" | "vaultRepays"
) => `vaultActivity_${type}_${vault.replace(/-/g, "")}`;

export const vaultActivitiesGraphql = (version: VaultVersion, chain: Chains) =>
  VaultList.reduce((acc, vault) => {
    let vaultAddress = VaultAddressMap[vault][version];
    if (isEVMChain(chain)) {
      vaultAddress = vaultAddress?.toLowerCase();
    }
    return (
      acc +
      `
          ${getVaultActivityKey(vault, "vaultBorrows")}:
          vaultBorrows(where: { vault_in: ["${vaultAddress}"] })
          {
            id
            borrowAmount
            borrower
            borrowedAt
            borrowTxhash
          }

          ${getVaultActivityKey(vault, "vaultRepays")}:
          vaultRepays(where: { vault_in: ["${vaultAddress}"] })
          {
            id
            repaidAmount
            repaidAt
            repayTxhash
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
          const vaultBorrowsData = responses[version]
            ? responses[version][getVaultActivityKey(vault, "vaultBorrows")] ||
              []
            : [];
          const vaultRepaysData = responses[version]
            ? responses[version][getVaultActivityKey(vault, "vaultRepays")] ||
              []
            : [];
          return [
            vault,
            [
              ...vaultBorrowsData.map((item: any) => ({
                ...item,
                borrowAmount: BigNumber.from(item.borrowAmount),
                date: new Date(item.borrowedAt * 1000),
                type: "borrow",
              })),
              ...vaultRepaysData.map((item: any) => ({
                ...item,
                repaidAmount: BigNumber.from(item.repaidAmount),
                date: new Date(item.repaidAt * 1000),
                type: "repay",
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
  vaultVersion: VaultVersion = "lend"
) => {
  const contextData = useContext(SubgraphDataContext);
  return {
    activities:
      contextData.vaultSubgraphData.vaultActivities[vaultVersion][vault],
    loading: contextData.vaultSubgraphData.loading,
  };
};

export default useVaultActivity;
