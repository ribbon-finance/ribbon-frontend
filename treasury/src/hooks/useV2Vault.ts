import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { RibbonV2stETHThetaVault, RibbonV2ThetaVault } from "shared/lib/codegen";
import { RibbonV2ThetaVaultFactory } from "shared/lib/codegen/RibbonV2ThetaVaultFactory";
import { VaultAddressMap, VaultOptions } from "../constants/constants";
import { useWeb3Context } from "shared/lib/hooks/web3Context";

export const getV2Vault = (
  library: any,
  vaultOption: VaultOptions,
  useSigner: boolean = true
) => {
  if (!VaultAddressMap[vaultOption].v2) {
    return null;
  }

  const provider = useSigner ? library.getSigner() : library;

  return RibbonV2ThetaVaultFactory.connect(
    VaultAddressMap[vaultOption].v2!,
    provider
  );
};

const useV2Vault = (vaultOption: VaultOptions) => {
  const { active, library } = useWeb3React();
  const { provider } = useWeb3Context();
  const [vault, setVault] = useState<
    RibbonV2ThetaVault | RibbonV2stETHThetaVault | null
  >(null);

  useEffect(() => {
    const vault = getV2Vault(library || provider, vaultOption, active);
    setVault(vault);
  }, [active, library, provider, vaultOption]);

  return vault;
};
export default useV2Vault;