import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";

import { PenaltyRewards, PenaltyRewards__factory } from "shared/lib/codegen";
import { PenaltyRewardsAddress } from "shared/lib/constants/constants";

export const getPenaltyRewards = (library: any): PenaltyRewards | undefined => {
  if (library) {
    const provider = library.getSigner();
    return PenaltyRewards__factory.connect(PenaltyRewardsAddress, provider);
  }

  return undefined;
};

const usePenaltyRewards = (): PenaltyRewards | undefined => {
  const { library, active } = useWeb3React();
  const [contract, setContract] = useState<PenaltyRewards>();

  useEffect(() => {
    setContract(getPenaltyRewards(library));
  }, [library, active]);

  return contract;
};

export default usePenaltyRewards;
