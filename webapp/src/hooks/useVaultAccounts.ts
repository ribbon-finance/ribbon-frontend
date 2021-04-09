import { useCallback, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import axios from "axios";
import { BigNumber } from "ethers";

import { VaultAccount } from "../models/vault";
import { getSubgraphqlURI } from "../utils/env";
import { VaultAddressMap, VaultOptions } from "../constants/constants";

const useVaultAccounts = (vaults: VaultOptions[]) => {
  const { account } = useWeb3React();
  const [vaultAccounts, setVaultAccounts] = useState<{
    [key: string]: VaultAccount;
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

const fetchVaultAccounts = async (
  vaults: VaultOptions[],
  account: string
): Promise<any> => {
  const response = await axios.post(getSubgraphqlURI(), {
    query: `
        {
          ${vaults.map(
            (vault) => `     
            ${vault.replace("-", "")}: vaultAccount(id:"${VaultAddressMap[
              vault
            ]()}-${account.toLowerCase()}") {
              totalDeposits
              totalYieldEarned
            }
          `
          )}
        }
        `,
  });

  return Object.fromEntries(
    (vaults as string[]).map((vault): [string, VaultAccount | undefined] => {
      const data = response.data.data[vault.replace("-", "")];

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

  // return vaults.map((vault) =>
  //   response.data.data[vault.replace("-", "")].map((item: any) => ({
  //     ...item,
  //     totalDeposits: BigNumber.from(item.totalDeposits),
  //     totalYieldEarned: BigNumber.from(item.totalYieldEarned),
  //   }))
  // );
};

export default useVaultAccounts;
