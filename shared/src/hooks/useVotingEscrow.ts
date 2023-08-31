import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";

import { VotingEscrowFactory } from "../codegen/VotingEscrowFactory";
import { VotingEscrow } from "../codegen";
import { VotingEscrowAddress } from "../constants/constants";
import useWeb3Wallet from "./useWeb3Wallet";
import { useWeb3Context } from "./web3Context";

export const getVotingEscrow = (library: any): VotingEscrow | undefined => {
  if (library) {
    const provider = library.getSigner();
    return VotingEscrowFactory.connect(VotingEscrowAddress, provider);
  }

  return undefined;
};

const useVotingEscrow = (): VotingEscrow | undefined => {
  const { provider } = useWeb3React();
  const { active } = useWeb3Wallet();
  const { provider: defaultProvider } = useWeb3Context();

  const [contract, setContract] = useState<VotingEscrow>();

  useEffect(() => {
    setContract(getVotingEscrow(provider || defaultProvider));
  }, [active, provider, defaultProvider]);

  return contract;
};

export default useVotingEscrow;
