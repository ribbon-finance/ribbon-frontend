import { BigNumber } from "@ethersproject/bignumber";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

import {
  VaultLiquidityMiningMap,
  VaultOptions,
} from "shared/lib/constants/constants";
import { getSubgraphqlURI } from "shared/lib/utils/env";
import { StakingPool } from "../models/staking";

const useStakingPool = (vaults: VaultOptions[]) => {
  const [stakingPools, setStakingPools] = useState<{
    [key: string]: StakingPool | undefined;
  }>({});
  const [loading, setLoading] = useState(false);

  const loadStakingPools = useCallback(async (vs: VaultOptions[]) => {
    setLoading(true);
    setStakingPools(await fetchStakingPools(vs));
    setLoading(false);
  }, []);

  useEffect(() => {
    loadStakingPools(vaults);
  }, [vaults, loadStakingPools]);

  return { stakingPools, loading };
};

const fetchStakingPools = async (vaults: VaultOptions[]) => {
  const response = await axios.post(getSubgraphqlURI(), {
    query: `
        {
          ${vaults.map(
            (vault) => `     
            ${vault.replace(
              /-/g,
              ""
            )}: vaultLiquidityMiningPool(id:"${VaultLiquidityMiningMap[
              vault
            ]!.toLowerCase()}") {
              numDepositors
              totalSupply
              totalRewardClaimed
            }
          `
          )}
        }
        `,
  });

  return Object.fromEntries(
    (vaults as string[]).map((vault): [string, StakingPool | undefined] => {
      const data = response.data.data[vault.replace(/-/g, "")];

      if (!data) {
        return [vault, undefined];
      }

      return [
        vault,
        {
          ...data,
          totalSupply: BigNumber.from(data.totalSupply),
          totalRewardClaimed: BigNumber.from(data.totalRewardClaimed),
        },
      ];
    })
  );
};

export default useStakingPool;
