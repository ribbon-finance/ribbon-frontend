import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";

import {
  VotingEscrowDelegationProxy,
  VotingEscrowDelegationProxy__factory,
} from "shared/lib/codegen";
import { VotingEscrowDelegationProxyAddress } from "shared/lib/constants/constants";
import useWeb3Wallet from "shared/lib/hooks/useWeb3Wallet";
import { useWeb3Context } from "shared/lib/hooks/web3Context";

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
  const { provider } = useWeb3React();
  const { active } = useWeb3Wallet();
  const { provider: defaultProvider } = useWeb3Context();
  const [contract, setContract] = useState<VotingEscrowDelegationProxy>();

  useEffect(() => {
    setContract(getVotingEscrowDelegationProxy(provider || defaultProvider));
  }, [active, provider, defaultProvider]);

  return contract;
};

export default useVotingEscrowDelegationProxy;
