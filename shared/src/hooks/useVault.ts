import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { RibbonCoveredCall } from "../codegen";
import { RibbonCoveredCallFactory } from "../codegen/RibbonCoveredCallFactory";
import { VaultAddressMap, VaultOptions } from "../constants/constants";
import { useWeb3Context } from "./web3Context";
import useWeb3Wallet from "./useWeb3Wallet";

export const getVault = (
  library: any,
  vaultOption: VaultOptions,
  useSigner: boolean = true
) => {
  if (!VaultAddressMap[vaultOption].v1) {
    return null;
  }

  const provider = library;

  const vault = RibbonCoveredCallFactory.connect(
    VaultAddressMap[vaultOption].v1!,
    provider
  );
  return vault;
};

const useVault = (vaultOption: VaultOptions) => {
  const { provider } = useWeb3React();
  const { active } = useWeb3Wallet();
  const { provider: defaultProvider } = useWeb3Context();
  const [vault, setVault] = useState<RibbonCoveredCall | null>(null);

  useEffect(() => {
    const vault = getVault(provider || defaultProvider, vaultOption, active);
    setVault(vault);
  }, [active, defaultProvider, provider, vaultOption]);

  return vault;
};
export default useVault;
