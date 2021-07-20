import { BigNumber } from "@ethersproject/bignumber";
import { useWeb3React } from "@web3-react/core";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

import {
  VaultLiquidityMiningMap,
  VaultOptions,
} from "shared/lib/constants/constants";
import { getSubgraphqlURI } from "shared/lib/utils/env";
import { StakingPoolAccount } from "../models/staking";
import { impersonateAddress } from "shared/lib/utils/development";

const useStakingAccount = (vaults: VaultOptions[]) => {
  const web3Context = useWeb3React();
  const account = impersonateAddress ? impersonateAddress : web3Context.account;
  // TODO: Global state
  const [stakingAccounts, setStakingAccounts] = useState<{
    [key: string]: StakingPoolAccount | undefined;
  }>({});
  const [loading, setLoading] = useState(false);

  const loadStakingAccounts = useCallback(
    async (vs: VaultOptions[], acc: string) => {
      setLoading(true);
      setStakingAccounts(await fetchStakingAccounts(vs, acc));
      setLoading(false);
    },
    []
  );

  useEffect(() => {
    if (!account) {
      setStakingAccounts({});
      return;
    }

    loadStakingAccounts(vaults, account);
  }, [vaults, account, loadStakingAccounts]);

  return { stakingAccounts, loading };
};

const fetchStakingAccounts = async (
  vaults: VaultOptions[],
  account: string
) => {
  const response = await axios.post(getSubgraphqlURI(), {
    query: `
        {
          ${vaults.map(
            (vault) => `     
            ${vault.replace(
              /-/g,
              ""
            )}: vaultLiquidityMiningPoolAccount(id:"${VaultLiquidityMiningMap[
              vault
            ]!.toLowerCase()}-${account.toLowerCase()}") {
              pool {
                numDepositors
                totalSupply
                totalRewardClaimed
              }
              totalRewardClaimed
              totalBalance
            }
          `
          )}
        }
        `,
  });

  return Object.fromEntries(
    (vaults as string[]).map((vault): [
      string,
      StakingPoolAccount | undefined
    ] => {
      const data = response.data.data[vault.replace(/-/g, "")];

      if (!data) {
        return [vault, undefined];
      }

      return [
        vault,
        {
          ...data,
          totalRewardClaimed: BigNumber.from(data.totalRewardClaimed),
          totalBalance: BigNumber.from(data.totalBalance),
          pool: {
            ...data.pool,
            totalSupply: BigNumber.from(data.pool.totalSupply),
            totalRewardClaimed: BigNumber.from(data.pool.totalRewardClaimed),
          },
        },
      ];
    })
  );
};

export default useStakingAccount;
