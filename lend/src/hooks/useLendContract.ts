import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { RibbonLendVault } from "../codegen";
import { RibbonLendVault__factory } from "../codegen/factories/RibbonLendVault__factory";
import { VaultAddressMap, VaultOptions } from "../constants/constants";
import { useWeb3Context } from "shared/lib/hooks/web3Context";

export const getLendContract = (
  library: any,
  vaultOption: VaultOptions,
  useSigner: boolean = true
) => {
  const provider = useSigner ? library.getSigner() : library;

  return RibbonLendVault__factory.connect(
    VaultAddressMap[vaultOption].lend,
    provider
  );
};

const useLendContract = (vaultOption: VaultOptions) => {
  const { active, library } = useWeb3React();
  const { provider } = useWeb3Context();
  const [vault, setVault] = useState<RibbonLendVault | null>(null);

  useEffect(() => {
    const vault = getLendContract(library || provider, vaultOption, active);
    setVault(vault);
  }, [active, library, provider, vaultOption]);

  return vault;
};
export default useLendContract;
