import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";

import { IncentivizedVotingLockupFactory } from "shared/lib/codegen/IncentivizedVotingLockupFactory";
import { IncentivizedVotingLockup } from "shared/lib/codegen";
import { IncentivizedVotingLockupAddress } from "../constants/constants";

export const getIncentizedVotingLockup = (
  library: any
): IncentivizedVotingLockup | undefined => {
  if (library) {
    const provider = library.getSigner();
    return IncentivizedVotingLockupFactory.connect(
      IncentivizedVotingLockupAddress,
      provider
    );
  }

  return undefined;
};

const useInventizedVotingLockup = (): IncentivizedVotingLockup | undefined => {
  const { library, active } = useWeb3React();
  const [contract, setContract] = useState<IncentivizedVotingLockup>();

  useEffect(() => {
    setContract(getIncentizedVotingLockup(library));
  }, [library, active]);

  return contract;
};

export default useInventizedVotingLockup;
