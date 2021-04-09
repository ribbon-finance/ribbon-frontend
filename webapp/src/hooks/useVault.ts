import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { RibbonCoveredCall, RibbonCoveredCall__factory } from "../codegen";
import { VaultAddressMap, VaultOptions } from "../constants/constants";

export const getVault = (
  library: any,
  vaultOption: VaultOptions,
  useSigner: boolean = true
) => {
  if (library) {
    const provider = useSigner ? library.getSigner() : library;

    const vault = RibbonCoveredCall__factory.connect(
      VaultAddressMap[vaultOption](),
      provider
    );
    return vault;
  }
  return null;
};

const useVault = (vaultOption: VaultOptions) => {
  const { library, active } = useWeb3React();
  const [vault, setVault] = useState<RibbonCoveredCall | null>(null);

  useEffect(() => {
    if (active && library) {
      const vault = getVault(library, vaultOption);
      setVault(vault);
    }
  }, [library, active, vaultOption]);

  return vault;
};
export default useVault;
