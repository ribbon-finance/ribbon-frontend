import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";

import { RibbonStakingRewards } from "../codegen";
import { RibbonStakingRewardsFactory } from "../codegen/RibbonStakingRewardsFactory";
import {
  StakingVaultOptions,
  VaultLiquidityMiningMap,
} from "../constants/constants";
import { useWeb3Context } from "./web3Context";
import useWeb3Wallet from "./useWeb3Wallet";

export const getStakingReward = (
  library: any,
  vaultOption: StakingVaultOptions,
  useSigner: boolean = true
) => {
  const provider = useSigner ? library.getSigner() : library;

  if (!VaultLiquidityMiningMap.lm[vaultOption]) {
    return null;
  }

  return RibbonStakingRewardsFactory.connect(
    VaultLiquidityMiningMap.lm[vaultOption]!,
    provider
  );
};

const useStakingReward = (vaultOption: StakingVaultOptions) => {
  const { provider } = useWeb3React();
  const { active } = useWeb3Wallet();
  const { provider: defaultProvider } = useWeb3Context();
  const [stakingReward, setStakingReward] =
    useState<RibbonStakingRewards | null>(null);

  useEffect(() => {
    if (provider) {
      const vault = getStakingReward(provider || defaultProvider, vaultOption, active);
      setStakingReward(vault);
    }
  }, [provider, active, vaultOption, defaultProvider]);

  return stakingReward;
};

export default useStakingReward;
