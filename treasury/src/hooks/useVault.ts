import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { RibbonCoveredCall } from "shared/lib/codegen";
import { RibbonCoveredCallFactory } from "shared/lib/codegen/RibbonCoveredCallFactory";
import { VaultAddressMap, VaultOptions } from "../constants/constants";
import { useWeb3Context } from "./web3Context";

export const getVault = (
  library: any,
  vaultOption: VaultOptions,
  useSigner: boolean = true
) => {
  if (!VaultAddressMap[vaultOption].v1) {
    return null;
  }

  const provider = useSigner ? library.getSigner() : library;

  const vault = RibbonCoveredCallFactory.connect(
    VaultAddressMap[vaultOption].v1!,
    provider
  );
  return vault;
};

const useVault = (vaultOption: VaultOptions) => {
  const { library, active } = useWeb3React();
  const { provider } = useWeb3Context();
  const [vault, setVault] = useState<RibbonCoveredCall | null>(null);

  useEffect(() => {
    const vault = getVault(library || provider, vaultOption, active);
    setVault(vault);
  }, [active, library, provider, vaultOption]);

  return vault;
};
export default useVault;
