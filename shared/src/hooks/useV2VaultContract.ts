import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { RibbonV2stETHThetaVault, RibbonV2ThetaVault } from "../codegen";
import { RibbonV2ThetaVaultFactory } from "../codegen/RibbonV2ThetaVaultFactory";
import { RibbonV2stETHThetaVaultFactory } from "../codegen/RibbonV2stETHThetaVaultFactory";
import {
  isSolanaVault,
  VaultAddressMap,
  VaultOptions,
} from "../constants/constants";
import { useWeb3Context } from "./web3Context";

export const getV2VaultContract = (
  library: any,
  vaultOption: VaultOptions,
  useSigner: boolean = true
) => {
  if (!VaultAddressMap[vaultOption].v2) {
    return null;
  }

  const provider = useSigner ? library.getSigner() : library;

  switch (vaultOption) {
    case "rstETH-THETA":
      return RibbonV2stETHThetaVaultFactory.connect(
        VaultAddressMap[vaultOption].v2!,
        provider
      );
    default:
      return RibbonV2ThetaVaultFactory.connect(
        VaultAddressMap[vaultOption].v2!,
        provider
      );
  }
};

const useV2VaultContract = (vaultOption: VaultOptions) => {
  const { active, library } = useWeb3React();
  const { provider } = useWeb3Context();
  const [vault, setVault] = useState<
    RibbonV2ThetaVault | RibbonV2stETHThetaVault | null
  >(null);

  useEffect(() => {
    if (isSolanaVault(vaultOption)) return;
    const vault = getV2VaultContract(library || provider, vaultOption, active);
    setVault(vault);
  }, [active, library, provider, vaultOption]);

  return vault;
};
export default useV2VaultContract;
