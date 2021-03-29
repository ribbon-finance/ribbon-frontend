import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { RibbonCoveredCall, RibbonCoveredCall__factory } from "../codegen";
import deployments from "../constants/deployments.json";
import { NETWORK_NAMES } from "../constants/constants";

export const getVault = (chainId: number, library: any) => {
  if (chainId && library) {
    const signer = library.getSigner();
    const networkName = NETWORK_NAMES[chainId];
    if (networkName === "kovan" || networkName === "mainnet") {
      const deployment = deployments[networkName];
      const vault = RibbonCoveredCall__factory.connect(
        deployment.RibbonETHCoveredCall,
        signer
      );
      return vault;
    } else {
      return null;
    }
  }
  return null;
};

const useVault = () => {
  const { chainId, library, active } = useWeb3React();
  const [vault, setVault] = useState<RibbonCoveredCall | null>(null);

  useEffect(() => {
    if (active && chainId && library) {
      const vault = getVault(chainId, library);
      setVault(vault);
    }
  }, [chainId, library, active]);

  return vault;
};
export default useVault;
