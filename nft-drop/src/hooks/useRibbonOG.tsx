import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";

import { RibbonOG } from "shared/lib/codegen";
import { RibbonOGFactory } from "shared/lib/codegen/RibbonOGFactory";
import { useWeb3Context } from "shared/lib/hooks/web3Context";
import { RibbonOGAddress } from "../constants/constants";

export const getRibbonOG = (library: any, useSigner: boolean = true) => {
  const provider = useSigner ? library.getSigner() : library;

  const contract = RibbonOGFactory.connect(RibbonOGAddress, provider);
  return contract;
};

const useRibbonOG = () => {
  const { library, active } = useWeb3React();
  const { provider } = useWeb3Context();
  const [contract, setContract] = useState<RibbonOG | null>(null);

  useEffect(() => {
    const contract = getRibbonOG(library || provider, active);
    setContract(contract);
  }, [active, library, provider]);

  return contract;
};
export default useRibbonOG;
