import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";

import {
  RibbonStakingRewards,
} from "shared/lib/codegen";
import { RibbonStakingRewardsFactory } from "shared/lib/codegen/RibbonStakingRewardsFactory"
import {
  VaultLiquidityMiningMap,
  VaultOptions,
} from "shared/lib/constants/constants";
import { useWeb3Context } from "shared/lib/hooks/web3Context";

export const getStakingReward = (
  library: any,
  vaultOption: VaultOptions,
  useSigner: boolean = true
) => {
  const provider = useSigner ? library.getSigner() : library;

  return RibbonStakingRewardsFactory.connect(
    VaultLiquidityMiningMap[vaultOption]!,
    provider
  );
};

const useStakingReward = (vaultOption: VaultOptions) => {
  const { active, library } = useWeb3React();
  const { provider } = useWeb3Context();
  const [
    stakingReward,
    setStakingReward,
  ] = useState<RibbonStakingRewards | null>(null);

  useEffect(() => {
    if (provider) {
      const vault = getStakingReward(library || provider, vaultOption, active);
      setStakingReward(vault);
    }
  }, [provider, active, library, vaultOption]);

  return stakingReward;
};

export default useStakingReward;
