import { useCallback, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import axios from "axios";
import { BigNumber } from "ethers";

import { VaultAccount } from "shared/lib/models/vault";
import { getSubgraphqlURI } from "shared/lib/utils/env";
import { VaultAddressMap, VaultOptions } from "shared/lib/constants/constants";

const useVaultAccounts = (vaults: VaultOptions[]) => {
  const { account } = useWeb3React();
  const [vaultAccounts, setVaultAccounts] = useState<{
    [key: string]: VaultAccount | undefined;
  }>({});
  const [loading, setLoading] = useState(false);

  const loadVaultAccounts = useCallback(
    async (vs: VaultOptions[], acc: string) => {
      setLoading(true);
      setVaultAccounts(await fetchVaultAccounts(vs, acc));
      setLoading(false);
    },
    []
  );

  useEffect(() => {
    if (!account) {
      setVaultAccounts({});
      return;
    }

    loadVaultAccounts(vaults, account);
  }, [vaults, account, loadVaultAccounts]);

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
            ]().toLowerCase()}-${account.toLowerCase()}") {
              totalDeposits
              totalYieldEarned
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
        },
      ];
    })
  );
};

export default useVaultAccounts;
