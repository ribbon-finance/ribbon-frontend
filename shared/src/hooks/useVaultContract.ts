import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import {
  RibbonV2stETHThetaVault,
  RibbonV2stETHThetaVault__factory,
  RibbonV2ThetaVault,
  RibbonEarnVault,
  RibbonEarnVault__factory,
} from "../codegen";
import { RibbonV2ThetaVault__factory } from "../codegen/factories/RibbonV2ThetaVault__factory";
import {
  isEarnVault,
  isSolanaVault,
  VaultAddressMap,
  VaultOptions,
} from "../constants/constants";
import useWeb3Wallet from "./useWeb3Wallet";

export const getVaultContract = (
  library: any,
  vaultOption: VaultOptions,
  useSigner: boolean = true
) => {
  if (!VaultAddressMap[vaultOption].v2 && !VaultAddressMap[vaultOption].earn) {
    return null;
  }
  const provider = useSigner ? library.getSigner() : library;
  if (isEarnVault(vaultOption)) {
    return RibbonEarnVault__factory.connect(
      VaultAddressMap[vaultOption].earn!,
      provider
    );
  }
  switch (vaultOption) {
    case "rstETH-THETA":
      return RibbonV2stETHThetaVault__factory.connect(
        VaultAddressMap[vaultOption].v2!,
        provider
      );
    default:
      return RibbonV2ThetaVault__factory.connect(
        VaultAddressMap[vaultOption].v2!,
        provider
      );
  }
};

const useVaultContract = (vaultOption: VaultOptions) => {
  const { provider } = useWeb3React();
  const { active } = useWeb3Wallet();
  const [vault, setVault] = useState<
    RibbonV2ThetaVault | RibbonV2stETHThetaVault | RibbonEarnVault | null
  >(null);

  useEffect(() => {
    if (isSolanaVault(vaultOption) || !provider) {
      setVault(null);
      return;
    }
    const vault = getVaultContract(provider, vaultOption, active);
    setVault(vault);
  }, [active, provider, vaultOption]);

  return vault;
};
export default useVaultContract;
