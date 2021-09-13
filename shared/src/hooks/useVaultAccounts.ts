import { useCallback, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import axios from "axios";
import { BigNumber } from "ethers";

import { impersonateAddress } from "../utils/development";
import {
  getSubgraphURIForVersion,
  VaultAddressMap,
  VaultOptions,
  VaultVersion,
  VaultVersionList,
} from "../constants/constants";
import { VaultAccount } from "../models/vault";
import { initialVaultAccounts, useGlobalState } from "../store/store";

const useVaultAccounts = (
  vaults: VaultOptions[],
  variant: VaultVersion | "all",
  {
    poll,
    pollingFrequency = 5000,
  }: {
    poll: boolean;
    pollingFrequency?: number;
  } = { poll: false, pollingFrequency: 5000 }
) => {
  const web3Context = useWeb3React();
  const account = impersonateAddress || web3Context.account;
  const [vaultAccounts, setVaultAccounts] = useGlobalState("vaultAccounts");
  const [loading, setLoading] = useState(false);

  const loadVaultAccounts = useCallback(
    async (
      _vaultOptions: VaultOptions[],
      _variant: VaultVersion | "all",
      acc: string,
      isInterval: boolean = true
    ) => {
      if (!isInterval) {
        setLoading(true);
      }

      const results = await fetchVaultAccounts(_vaultOptions, _variant, acc);
      setVaultAccounts((curr) => ({
        ...curr,
        [_variant]: {
          ...curr[_variant],
          ...results,
        },
      }));

      if (!isInterval) {
        setLoading(false);
      }
    },
    [setVaultAccounts]
  );

  useEffect(() => {
    if (!account) {
      setVaultAccounts(initialVaultAccounts);
      return;
    }

    let pollInterval: any = undefined;
    if (poll) {
      loadVaultAccounts(vaults, variant, account, false);
      pollInterval = setInterval(
        loadVaultAccounts,
        pollingFrequency,
        vaults,
        variant,
        account
      );
    } else {
      loadVaultAccounts(vaults, variant, account, false);
    }

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [
    vaults,
    variant,
    account,
    loadVaultAccounts,
    poll,
    pollingFrequency,
    setVaultAccounts,
  ]);

  return { vaultAccounts: vaultAccounts[variant], loading };
};

const fetchVaultAccounts = async (
  vaults: VaultOptions[],
  variant: VaultVersion | "all",
  account: string
) => {
  let vaultVersions: VaultVersion[];

  switch (variant) {
    case "all":
      vaultVersions = [...VaultVersionList];
      break;
    default:
      vaultVersions = [variant];
  }

  const vaultAccountsAcrossVersion = Object.fromEntries(
    await Promise.all(
      vaultVersions.map(async (version) => {
        const response = await axios.post(getSubgraphURIForVersion(version), {
          query: `
          {
            ${vaults
              .map((vault) => {
                const vaultAddress = VaultAddressMap[vault][version];

                if (!vaultAddress) {
                  return undefined;
                }

                return `     
                  ${vault.replace(
                    /-/g,
                    ""
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
                `;
              })
              .filter((query) => query)}
          }
          `,
        });

        return [
          version,
          Object.fromEntries(
            (vaults as string[]).map(
              (vault): [string, VaultAccount | undefined] => {
                const data = response.data.data
                  ? response.data.data[vault.replace(/-/g, "")]
                  : false;

                if (!data) {
                  return [vault, undefined];
                }

                return [
                  vault,
                  {
                    ...data,
                    totalDeposits: BigNumber.from(data.totalDeposits),
                    totalYieldEarned: BigNumber.from(data.totalYieldEarned),
                    totalBalance: BigNumber.from(data.totalBalance),
                    totalStakedShares: BigNumber.from(data.totalStakedShares),
                    totalStakedBalance: BigNumber.from(data.totalStakedBalance),
                    totalPendingDeposit: data.totalPendingDeposit
                      ? BigNumber.from(data.totalPendingDeposit)
                      : BigNumber.from(0),
                  },
                ];
              }
            )
          ),
        ];
      })
    )
  );

  // Combine vault account across different version
  return Object.fromEntries(
    vaults.map((vault) => {
      let vaultAccount: VaultAccount | undefined = undefined;

      for (let i = 0; i < vaultVersions.length; i++) {
        const currentVersionVaultAccount =
          vaultAccountsAcrossVersion[vaultVersions[i]][vault];

        if (!vaultAccount) {
          vaultAccount = currentVersionVaultAccount;
          continue;
        }

        if (!currentVersionVaultAccount) {
          continue;
        }

        vaultAccount = {
          ...(vaultAccount as VaultAccount),
          totalDeposits: vaultAccount.totalDeposits.add(
            currentVersionVaultAccount.totalDeposits
          ),
          totalYieldEarned: vaultAccount.totalYieldEarned.add(
            currentVersionVaultAccount.totalYieldEarned
          ),
          totalBalance: vaultAccount.totalBalance.add(
            currentVersionVaultAccount.totalBalance
          ),
          totalStakedShares: vaultAccount.totalStakedShares.add(
            currentVersionVaultAccount.totalStakedShares
          ),
          totalStakedBalance: vaultAccount.totalStakedBalance.add(
            currentVersionVaultAccount.totalStakedBalance
          ),
        };
      }

      return [vault, vaultAccount];
    })
  );
};

export default useVaultAccounts;
