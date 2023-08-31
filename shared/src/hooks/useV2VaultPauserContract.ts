import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";

import { RibbonVaultPauser } from "../codegen/RibbonVaultPauser";
import { RibbonVaultPauserAddress } from "../constants/constants";
import { RibbonVaultPauser__factory } from "../codegen/factories/RibbonVaultPauser__factory";
import { CHAINID } from "../constants/constants";
import useWeb3Wallet from "./useWeb3Wallet";
import { useWeb3Context } from "./web3Context";

export const getVaultPauser = (
  library: any,
  chainId: CHAINID
): RibbonVaultPauser | undefined => {
  if (library) {
    const provider = library.getSigner();
    const pauser = RibbonVaultPauserAddress[chainId];
    if (!pauser) {
      return;
    }
    return RibbonVaultPauser__factory.connect(pauser, provider);
  }

  return undefined;
};

const useVaultPauser = (chainId: CHAINID): RibbonVaultPauser | undefined => {
  const { provider } = useWeb3React();
  const { active } = useWeb3Wallet();
  const { provider: defaultProvider } = useWeb3Context();
  const [contract, setContract] = useState<RibbonVaultPauser>();

  useEffect(() => {
    const pauser = getVaultPauser(provider || defaultProvider, chainId);
    if (pauser) {
      setContract(pauser);
    }
  }, [active, chainId, provider, defaultProvider]);

  return contract;
};

export default useVaultPauser;
