import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";

import { VotingEscrowFactory } from "shared/lib/codegen/VotingEscrowFactory";
import { VotingEscrow } from "shared/lib/codegen";
import { VotingEscrowAddress } from "shared/lib/constants/constants";

export const getVotingEscrow = (library: any): VotingEscrow | undefined => {
  if (library) {
    const provider = library.getSigner();
    return VotingEscrowFactory.connect(VotingEscrowAddress, provider);
  }

  return undefined;
};

const useVotingEscrow = (): VotingEscrow | undefined => {
  const { library, active } = useWeb3React();
  const [contract, setContract] = useState<VotingEscrow>();

  useEffect(() => {
    setContract(getVotingEscrow(library));
  }, [library, active]);

  return contract;
};

export default useVotingEscrow;
