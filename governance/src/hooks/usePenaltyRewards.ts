import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";

import { PenaltyRewards, PenaltyRewards__factory } from "shared/lib/codegen";
import { PenaltyRewardsAddress } from "shared/lib/constants/constants";
import useWeb3Wallet from "shared/lib/hooks/useWeb3Wallet";
import { useWeb3Context } from "shared/lib/hooks/web3Context";

export const getPenaltyRewards = (library: any): PenaltyRewards | undefined => {
  if (library) {
    const provider = library.getSigner();
    return PenaltyRewards__factory.connect(PenaltyRewardsAddress, provider);
  }

  return undefined;
};

const usePenaltyRewards = (): PenaltyRewards | undefined => {
  const { provider } = useWeb3React();
  const { active } = useWeb3Wallet();
  const { provider: defaultProvider } = useWeb3Context();
  const [contract, setContract] = useState<PenaltyRewards>();

  useEffect(() => {
    setContract(getPenaltyRewards(provider || defaultProvider));
  }, [active, provider, defaultProvider]);

  return contract;
};

export default usePenaltyRewards;
