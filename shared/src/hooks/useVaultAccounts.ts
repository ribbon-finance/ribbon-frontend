import { BigNumber } from "ethers";
import { useContext } from "react";

import {
  VaultAddressMap,
  VaultList,
  VaultOptions,
  VaultVersion,
  VaultVersionList,
} from "../constants/constants";
import { VaultAccount, VaultAccountsData } from "../models/vault";
import { SubgraphDataContext } from "./subgraphDataContext";

const getVaultAccountKey = (vault: VaultOptions) =>
  `vaultAccount_${vault.replace(/-/g, "")}`;

export const vaultAccountsGraphql = (account: string, version: VaultVersion) =>
  VaultList.reduce((acc, vault) => {
    const vaultAddress = VaultAddressMap[vault][version];

    if (!vaultAddress) {
      return acc;
    }

    return (
      acc +
      `     
          ${getVaultAccountKey(
            vault
          )}: vaultAccount(id:"${vaultAddress.toLowerCase()}-${account.toLowerCase()}") {
            totalDeposits
            totalYieldEarned
            totalBalance
            totalStakedBalance
            totalStakedShares
            ${version === "v2" ? `totalPendingDeposit` : ``}
            vault {
              symbol
            }
          }
        `
    );
  }, "");

export const resolveVaultAccountsSubgraphResponse = (
  responses: { [vault in VaultVersion]: any | undefined }
): VaultAccountsData =>
  Object.fromEntries(
    VaultVersionList.map((version) => [
      version,
      Object.fromEntries(
        VaultList.map((vault) => {
          const data = responses[version]
            ? responses[version][getVaultAccountKey(vault)]
            : undefined;

          if (!data) {
            return [vault, undefined];
          }

          return [
            vault,
            {
              ...responses[version][getVaultAccountKey(vault)],
              totalDeposits: BigNumber.from(
                responses[version][getVaultAccountKey(vault)].totalDeposits
              ),
              totalYieldEarned: BigNumber.from(
                responses[version][getVaultAccountKey(vault)].totalYieldEarned
              ),
              totalBalance: BigNumber.from(
                responses[version][getVaultAccountKey(vault)].totalBalance
              ),
              totalStakedShares: BigNumber.from(
                responses[version][getVaultAccountKey(vault)].totalStakedShares
              ),
              totalStakedBalance: BigNumber.from(
                responses[version][getVaultAccountKey(vault)].totalStakedBalance
              ),
              totalPendingDeposit: responses[version][getVaultAccountKey(vault)]
                .totalPendingDeposit
                ? BigNumber.from(
                    responses[version][getVaultAccountKey(vault)]
                      .totalPendingDeposit
                  )
                : BigNumber.from(0),
            },
          ];
        })
      ),
    ])
  ) as VaultAccountsData;

export const useAllVaultAccounts = () => {
  const contextData = useContext(SubgraphDataContext);

  return { data: contextData.vaultAccounts, loading: contextData.loading };
};

const useVaultAccounts = (variant: VaultVersion | "all") => {
  const contextData = useContext(SubgraphDataContext);

  switch (variant) {
    case "all":
      return {
        vaultAccounts: Object.fromEntries(
          VaultList.map((vault) => [
            vault,
            VaultVersionList.reduce((acc, version) => {
              const currentVersionVaultAccount =
                contextData.vaultAccounts[version][vault];

              if (!acc) {
                return currentVersionVaultAccount;
              }

              if (!currentVersionVaultAccount) {
                return acc;
              }

              return {
                ...acc,
                totalDeposits: acc.totalDeposits.add(
                  currentVersionVaultAccount.totalDeposits
                ),
                totalYieldEarned: acc.totalYieldEarned.add(
                  currentVersionVaultAccount.totalYieldEarned
                ),
                totalBalance: acc.totalBalance.add(
                  currentVersionVaultAccount.totalBalance
                ),
                totalStakedShares: acc.totalStakedShares.add(
                  currentVersionVaultAccount.totalStakedShares
                ),
                totalStakedBalance: acc.totalStakedBalance.add(
                  currentVersionVaultAccount.totalStakedBalance
                ),
              };
            }, undefined as VaultAccount | undefined),
          ])
        ),
        loading: false,
      };
    default:
      return {
        vaultAccounts: contextData.vaultAccounts[variant],
        loading: contextData.loading,
      };
  }
};

export default useVaultAccounts;
