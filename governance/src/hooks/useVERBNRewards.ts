import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";

import { VeRBNRewardsFactory } from "shared/lib/codegen/VeRBNRewardsFactory";
import { VeRBNRewards } from "shared/lib/codegen";
import { VERBNRewardsAddress } from "shared/lib/constants/constants";

export const getVERBNRewards = (library: any): VeRBNRewards | undefined => {
  if (library) {
    const provider = library.getSigner();
    return VeRBNRewardsFactory.connect(VERBNRewardsAddress, provider);
  }

  return undefined;
};

const useVeRBNRewards = (): VeRBNRewards | undefined => {
  const { library, active } = useWeb3React();
  const [contract, setContract] = useState<VeRBNRewards>();

  useEffect(() => {
    setContract(getVERBNRewards(library));
  }, [library, active]);

  return contract;
};

export default useVeRBNRewards;
