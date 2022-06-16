import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";

import { RibbonVaultPauser } from "../codegen/RibbonVaultPauser";
import { RibbonVaultPauserAddress } from "../constants/constants";
import { RibbonVaultPauser__factory } from "../codegen/factories/RibbonVaultPauser__factory";
import { CHAINID } from "../utils/env";

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
  const { library, active } = useWeb3React();
  const [contract, setContract] = useState<RibbonVaultPauser>();

  useEffect(() => {
    const pauser = getVaultPauser(library, chainId);
    if (pauser) {
      setContract(pauser);
    }
  }, [library, active, chainId]);

  return contract;
};

export default useVaultPauser;
