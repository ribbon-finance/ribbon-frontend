import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { useContext } from "react";

import {
  getAssets,
  isSolanaVault,
  VaultAddressMap,
  VaultList,
  VaultOptions,
  VaultVersion,
  VaultVersionList,
} from "../constants/constants";
import {
  V2VaultDataResponses,
  VaultAccount,
  VaultAccountsData,
} from "../models/vault";
import { getAssetDecimals } from "../utils/asset";
import { SubgraphDataContext } from "./subgraphDataContext";
import useV2VaultContract from "./useV2VaultContract";
import { useV2VaultData, useV2VaultsData } from "./web3DataContext";

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
            totalStakedBalance
            totalStakedShares
            shares
            ${version === "v2" ? `totalPendingDeposit` : ``}
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
              shares: BigNumber.from(
                responses[version][getVaultAccountKey(vault)].shares
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

// TODO: - Temp code that recalculates totalBalance based on the pricePerShare from contract
// because the subgraph doesn't return the correct value (due to pps changing in contract unexpectedly)
// array of [vaultName, vaultAccount], which we then convert back into key: value of vaultName: vaultAccount
// When fixed please remove this
const recalculateV2VaultAccountsDataBalances = (
  vaultAccountsData: VaultAccountsData["v2"],
  v2VaultDataResponses: V2VaultDataResponses,
  vaultDataLoading: boolean
) => {
  const entries = Object.entries(vaultAccountsData).map(
    ([key, vaultAccount]) => {
      if (vaultAccount && !vaultDataLoading) {
        let totalBalance: BigNumber | undefined = vaultAccount?.totalBalance;
        let totalStakedBalance: BigNumber | undefined =
          vaultAccount?.totalStakedBalance;

        const data = v2VaultDataResponses[vaultAccount.vault.symbol];
        if (data) {
          const decimals = getAssetDecimals(
            getAssets(vaultAccount.vault.symbol)
          );
          totalStakedBalance = data.pricePerShare
            .mul(vaultAccount.totalStakedShares)
            .div(parseUnits("1", decimals));

          totalBalance = data.pricePerShare
            .mul(vaultAccount.shares)
            .div(parseUnits("1", decimals))
            .add(totalStakedBalance);
        }
        return [
          key,
          {
            ...vaultAccount,
            totalBalance,
            totalStakedBalance,
          },
        ];
      }
      return [key, vaultAccount];
    }
  );
  return Object.fromEntries(entries);
};

export const useAllVaultAccounts = () => {
  const contextData = useContext(SubgraphDataContext);
  const { data: vaultData, loading: vaultDataLoading } = useV2VaultsData();

  let data = contextData.vaultSubgraphData.vaultAccounts;
  // Object.keys(data).forEach((version) => {
  //   if (version === "v2") {
  //     data.v2 = recalculateV2VaultAccountsDataBalances(
  //       data.v2,
  //       vaultData,
  //       vaultDataLoading
  //     )
  //   }
  // })

  return {
    data,
    loading: contextData.vaultSubgraphData.loading,
  };
};

const useVaultAccounts = (variant: VaultVersion | "all") => {
  const contextData = useContext(SubgraphDataContext);
  const { data: vaultData, loading: vaultDataLoading } = useV2VaultsData();

  switch (variant) {
    case "all":
      return {
        vaultAccounts: Object.fromEntries(
          VaultList.map((vault) => [
            vault,
            VaultVersionList.reduce((acc, version) => {
              const currentVersionVaultAccount: VaultAccount | undefined =
                contextData.vaultSubgraphData.vaultAccounts[version][vault];

              if (!acc) {
                return currentVersionVaultAccount;
              }

              if (!currentVersionVaultAccount) {
                return acc;
              }

              let currentBalance = currentVersionVaultAccount.totalBalance;
              if (version === "v2" && !vaultDataLoading) {
                const data = vaultData[acc.vault.symbol];
                if (data) {
                  currentBalance = data.pricePerShare.mul(
                    currentVersionVaultAccount.shares
                  );
                }
              }

              return {
                ...acc,
                totalDeposits: acc.totalDeposits.add(
                  currentVersionVaultAccount.totalDeposits
                ),
                totalYieldEarned: acc.totalYieldEarned.add(
                  currentVersionVaultAccount.totalYieldEarned
                ),
                totalBalance: acc.totalBalance.add(currentBalance),
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
      let vaultAccounts = contextData.vaultSubgraphData.vaultAccounts[variant];
      if (variant === "v2") {
        vaultAccounts = recalculateV2VaultAccountsDataBalances(
          contextData.vaultSubgraphData.vaultAccounts[variant],
          vaultData,
          vaultDataLoading
        );
      }
      return {
        vaultAccounts,
        loading: contextData.vaultSubgraphData.loading,
      };
  }
};

export default useVaultAccounts;
