import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";

import { PenaltyRewards, PenaltyRewards__factory } from "shared/lib/codegen";
import { PenaltyRewardsPostTimestampAddress } from "shared/lib/constants/constants";

export const getPenaltyRewardsPostTimestamp = (
  library: any
): PenaltyRewards | undefined => {
  if (library) {
    const provider = library.getSigner();
    return PenaltyRewards__factory.connect(
      PenaltyRewardsPostTimestampAddress,
      provider
    );
  }

  return undefined;
};

const usePenaltyRewardsPostTimestamp = (): PenaltyRewards | undefined => {
  const { library, active } = useWeb3React();
  const [contract, setContract] = useState<PenaltyRewards>();

  useEffect(() => {
    setContract(getPenaltyRewardsPostTimestamp(library));
  }, [library, active]);

  return contract;
};

export default usePenaltyRewardsPostTimestamp;
