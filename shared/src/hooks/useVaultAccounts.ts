import { useCallback, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import axios from "axios";
import { BigNumber } from "ethers";

import { impersonateAddress } from "../utils/development";
import { VaultAddressMap, VaultOptions } from "../constants/constants";
import { VaultAccount } from "../models/vault";
import { getSubgraphqlURI } from "../utils/env";
import { initialVaultaccounts, useGlobalState } from "../store/store";

const useVaultAccounts = (vaults: VaultOptions[]) => {
  const web3Context = useWeb3React();
  const account = impersonateAddress || web3Context.account;
  const [vaultAccounts, setVaultAccounts] = useGlobalState("vaultAccounts")
  const [loading, setLoading] = useState(false);

  const loadVaultAccounts = useCallback(
    async (vs: VaultOptions[], acc: string) => {
      setLoading(true);
      const results = await fetchVaultAccounts(vs, acc)
      setVaultAccounts((curr) => ({
        ...curr,
        ...results
      }));
      setLoading(false);
    },
    [setVaultAccounts]
  );

  useEffect(() => {
    if (!account) {
      setVaultAccounts(initialVaultaccounts);
      return;
    }

    loadVaultAccounts(vaults, account);
  }, [vaults, account, loadVaultAccounts, setVaultAccounts]);

  return { vaultAccounts, loading };
};

const fetchVaultAccounts = async (vaults: VaultOptions[], account: string) => {
  const response = await axios.post(getSubgraphqlURI(), {
    query: `
        {
          ${vaults.map(
            (vault) => `     
            ${vault.replace(/-/g, "")}: vaultAccount(id:"${VaultAddressMap[
              vault
            ].v1.toLowerCase()}-${account.toLowerCase()}") {
              totalDeposits
              totalYieldEarned
              totalBalance
              totalStakedBalance
              totalStakedShares
              vault {
                symbol
              }
            }
          `
          )}
        }
        `,
  });

  return Object.fromEntries(
    (vaults as string[]).map((vault): [string, VaultAccount | undefined] => {
      const data = response.data.data[vault.replace(/-/g, "")];

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
        },
      ];
    })
  );
};

export default useVaultAccounts;
