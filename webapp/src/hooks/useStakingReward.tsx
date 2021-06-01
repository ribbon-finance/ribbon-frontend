import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";

import {
  RibbonStakingRewards,
  RibbonStakingRewards__factory,
} from "shared/lib/codegen";
import {
  VaultLiquidityMiningMap,
  VaultOptions,
} from "shared/lib/constants/constants";

export const getStakingReward = (
  library: any,
  vaultOption: VaultOptions,
  useSigner: boolean = true
) => {
  if (library) {
    const provider = useSigner ? library.getSigner() : library;

    return RibbonStakingRewards__factory.connect(
      VaultLiquidityMiningMap[vaultOption],
      provider
    );
  }

  return undefined;
};

const useStakingReward = (vaultOption: VaultOptions) => {
  const { library, active } = useWeb3React();
  const [
    stakingReward,
    setStakingReward,
  ] = useState<RibbonStakingRewards | null>(null);

  useEffect(() => {
    if (library) {
      const vault = getStakingReward(library, vaultOption, active);
      setStakingReward(vault);
    }
  }, [library, active, vaultOption]);

  return stakingReward;
};

export default useStakingReward;
