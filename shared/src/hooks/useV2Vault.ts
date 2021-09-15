import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { RibbonV2ThetaVault } from "../codegen";
import { RibbonV2ThetaVaultFactory } from "../codegen/RibbonV2ThetaVaultFactory";
import { VaultAddressMap, VaultOptions } from "../constants/constants";
import { useWeb3Context } from "./web3Context";

export const getV2Vault = (
  library: any,
  vaultOption: VaultOptions,
  useSigner: boolean = true
) => {
  if (!VaultAddressMap[vaultOption].v2) {
    return null;
  }

  const provider = useSigner ? library.getSigner() : library;

  const vault = RibbonV2ThetaVaultFactory.connect(
    VaultAddressMap[vaultOption].v2!,
    provider
  );

  return vault;
};

const useV2Vault = (vaultOption: VaultOptions) => {
  const { active, library } = useWeb3React();
  const { provider } = useWeb3Context();
  const [vault, setVault] = useState<RibbonV2ThetaVault | null>(null);

  useEffect(() => {
    const vault = getV2Vault(library || provider, vaultOption, active);
    setVault(vault);
  }, [active, library, provider, vaultOption]);

  return vault;
};
export default useV2Vault;
