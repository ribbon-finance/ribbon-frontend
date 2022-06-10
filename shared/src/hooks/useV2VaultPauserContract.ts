import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";

import { RibbonVaultPauser } from "../codegen/RibbonVaultPauser";
import { RibbonVaultPauserAddress } from "../constants/constants";
import { RibbonVaultPauser__factory } from "../codegen/factories/RibbonVaultPauser__factory";

export const getVaultPauser = (library: any): RibbonVaultPauser | undefined => {
  if (library) {
    const provider = library.getSigner();
    return RibbonVaultPauser__factory.connect(
      RibbonVaultPauserAddress,
      provider
    );
  }

  return undefined;
};

const useVaultPauser = (): RibbonVaultPauser | undefined => {
  const { library, active } = useWeb3React();
  const [contract, setContract] = useState<RibbonVaultPauser>();

  useEffect(() => {
    setContract(getVaultPauser(library));
  }, [library, active]);

  return contract;
};

export default useVaultPauser;
