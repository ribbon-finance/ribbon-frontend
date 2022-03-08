import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";

import {
  VotingEscrowDelegationProxy,
  VotingEscrowDelegationProxy__factory,
} from "shared/lib/codegen";
import { VotingEscrowDelegationProxyAddress } from "shared/lib/constants/constants";

export const getVotingEscrowDelegationProxy = (
  library: any
): VotingEscrowDelegationProxy | undefined => {
  if (library) {
    const provider = library.getSigner();
    return VotingEscrowDelegationProxy__factory.connect(
      VotingEscrowDelegationProxyAddress,
      provider
    );
  }

  return undefined;
};

const useVotingEscrowDelegationProxy = ():
  | VotingEscrowDelegationProxy
  | undefined => {
  const { library, active } = useWeb3React();
  const [contract, setContract] = useState<VotingEscrowDelegationProxy>();

  useEffect(() => {
    setContract(getVotingEscrowDelegationProxy(library));
  }, [library, active]);

  return contract;
};

export default useVotingEscrowDelegationProxy;
