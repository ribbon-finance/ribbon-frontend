import { BigNumber } from "ethers";
import { useContext } from "react";

import {
  isSolanaVault,
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

export const vaultAccountsGraphql = (_account: string, version: VaultVersion) =>
  VaultList.reduce((acc, vault) => {
    let vaultAddress = VaultAddressMap[vault][version];

    let account = `${_account}`;

    if (!vaultAddress) {
      return acc;
    }
    if (!isSolanaVault(vault)) {
      vaultAddress = vaultAddress.toLowerCase();
      account = _account.toLowerCase();
    }
    return (
      acc +
      `
          ${getVaultAccountKey(
            vault
          )}: vaultAccount(id:"${vaultAddress}-${account}") {
            totalDeposits
            totalYieldEarned
            totalBalance
            ${version !== "earn" ? `totalStakedBalance` : ``}
            ${version !== "earn" ? `totalStakedShares` : ``}
            ${version !== "v1" ? `totalPendingDeposit` : ``}
            vault {
              symbol
            }
          }
        `
    );
  }, "");

export const resolveVaultAccountsSubgraphResponse = (responses: {
  [version in VaultVersion]: any | undefined;
}): VaultAccountsData =>
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
              totalStakedShares: responses[version][getVaultAccountKey(vault)]
                .totalStakedShares
                ? BigNumber.from(
                    responses[version][getVaultAccountKey(vault)]
                      .totalStakedShares
                  )
                : BigNumber.from(0),
              totalStakedBalance: responses[version][getVaultAccountKey(vault)]
                .totalStakedBalance
                ? BigNumber.from(
                    responses[version][getVaultAccountKey(vault)]
                      .totalStakedBalance
                  )
                : BigNumber.from(0),
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

  return {
    data: contextData.vaultSubgraphData.vaultAccounts,
    loading: contextData.vaultSubgraphData.loading,
  };
};

const useVaultAccounts = (variant: VaultVersion | "all") => {
  const contextData = useContext(SubgraphDataContext);

  switch (variant) {
    // case "earn":
    //   // console.log(
    //   //   Object.fromEntries(
    //   //     EarnVaultMap.map((vault) => [
    //   //       vault,
    //   //       VaultVersionList.reduce((acc) => {
    //   //         const currentVersionVaultAccount =
    //   //           contextData.vaultSubgraphData.earnVaultAccounts[vault];

    //   //         if (!acc) {
    //   //           return currentVersionVaultAccount;
    //   //         }

    //   //         if (!currentVersionVaultAccount) {
    //   //           return acc;
    //   //         }

    //   //         return {
    //   //           ...acc,
    //   //           totalDeposits: acc.totalDeposits.add(
    //   //             currentVersionVaultAccount.totalDeposits
    //   //           ),
    //   //           totalYieldEarned: acc.totalYieldEarned.add(
    //   //             currentVersionVaultAccount.totalYieldEarned
    //   //           ),
    //   //           totalBalance: acc.totalBalance.add(
    //   //             currentVersionVaultAccount.totalBalance
    //   //           ),
    //   //           totalStakedShares: acc.totalStakedShares.add(
    //   //             currentVersionVaultAccount.totalStakedShares
    //   //           ),
    //   //           totalStakedBalance: acc.totalStakedBalance.add(
    //   //             currentVersionVaultAccount.totalStakedBalance
    //   //           ),
    //   //         };
    //   //       }, undefined as EarnVaultAccount | undefined),
    //   //     ])
    //   //   )
    //   // );
    //   return {
    //     // earnVaultAccounts: Object.fromEntries(
    //     //   EarnVaultMap.map((vault) => [
    //     //     vault,
    //     //     VaultVersionList.reduce((acc, version) => {
    //     //       const currentVersionVaultAccount =
    //     //         contextData.vaultSubgraphData.earnVaultAccounts[vault];

    //     //       if (!acc) {
    //     //         return currentVersionVaultAccount;
    //     //       }

    //     //       if (!currentVersionVaultAccount) {
    //     //         return acc;
    //     //       }

    //     //       return {
    //     //         ...acc,
    //     //         totalDeposits: acc.totalDeposits.add(
    //     //           currentVersionVaultAccount.totalDeposits
    //     //         ),
    //     //         totalYieldEarned: acc.totalYieldEarned.add(
    //     //           currentVersionVaultAccount.totalYieldEarned
    //     //         ),
    //     //         totalBalance: acc.totalBalance.add(
    //     //           currentVersionVaultAccount.totalBalance
    //     //         ),
    //     //         totalStakedShares: acc.totalStakedShares.add(
    //     //           currentVersionVaultAccount.totalStakedShares
    //     //         ),
    //     //         totalStakedBalance: acc.totalStakedBalance.add(
    //     //           currentVersionVaultAccount.totalStakedBalance
    //     //         ),
    //     //       };
    //     //     }, undefined as EarnVaultAccount | undefined),
    //     //   ])
    //     // ),
    //     vaultAccounts: Object.fromEntries(
    //       VaultList.map((vault) => [
    //         vault,
    //         VaultVersionList.reduce((acc, version) => {
    //           const currentVersionVaultAccount =
    //             contextData.vaultSubgraphData.vaultAccounts[version][vault];

    //           if (!acc) {
    //             return currentVersionVaultAccount;
    //           }

    //           if (!currentVersionVaultAccount) {
    //             return acc;
    //           }

    //           return {
    //             ...acc,
    //             totalDeposits: acc.totalDeposits.add(
    //               currentVersionVaultAccount.totalDeposits
    //             ),
    //             totalYieldEarned: acc.totalYieldEarned.add(
    //               currentVersionVaultAccount.totalYieldEarned
    //             ),
    //             totalBalance: acc.totalBalance.add(
    //               currentVersionVaultAccount.totalBalance
    //             ),
    //             totalStakedShares: acc.totalStakedShares.add(
    //               currentVersionVaultAccount.totalStakedShares
    //             ),
    //             totalStakedBalance: acc.totalStakedBalance.add(
    //               currentVersionVaultAccount.totalStakedBalance
    //             ),
    //           };
    //         }, undefined as VaultAccount | undefined),
    //       ])
    //     ),
    //     loading: false,
    //   };
    case "all":
      return {
        vaultAccounts: Object.fromEntries(
          VaultList.map((vault) => [
            vault,
            VaultVersionList.reduce((acc, version) => {
              const currentVersionVaultAccount =
                contextData.vaultSubgraphData.vaultAccounts[version][vault];

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
        vaultAccounts: contextData.vaultSubgraphData.vaultAccounts[variant],
        loading: contextData.vaultSubgraphData.loading,
      };
  }
};

export default useVaultAccounts;
