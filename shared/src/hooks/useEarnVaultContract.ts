import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { RibbonEarnVault, RibbonEarnVault__factory } from "../codegen";
import { VaultAddressMap, VaultOptions } from "../constants/constants";
import { useWeb3Context } from "./web3Context";

export const getEarnVaultContract = (
  library: any,
  vaultOption: VaultOptions,
  useSigner: boolean = true
) => {
  const provider = useSigner ? library.getSigner() : library;

  return RibbonEarnVault__factory.connect(
    VaultAddressMap[vaultOption].earn!,
    provider
  );
};

const useEarnVaultContract = (vaultOption: VaultOptions) => {
  const { active, library } = useWeb3React();
  const { provider } = useWeb3Context();
  const [vault, setVault] = useState<RibbonEarnVault | null>(null);

  useEffect(() => {
    const vault = getEarnVaultContract(
      library || provider,
      vaultOption,
      active
    );
    setVault(vault);
  }, [active, library, provider, vaultOption]);

  return vault;
};
export default useEarnVaultContract;
