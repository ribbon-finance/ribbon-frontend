import { RibbonCoveredCall__factory } from "../codegen";
import deployments from "../constants/deployments.json";
import { NETWORK_NAMES } from "../constants/constants";

export const getVault = (
  chainId: number,
  library: any,
  useSigner: boolean = true
) => {
  if (chainId && library) {
    const provider = useSigner ? library.getSigner() : library;
    const networkName = NETWORK_NAMES[chainId];
    if (networkName === "kovan" || networkName === "mainnet") {
      const deployment = deployments[networkName];
      const vault = RibbonCoveredCall__factory.connect(
        deployment.RibbonETHCoveredCall,
        provider
      );
      return vault;
    } else {
      return null;
    }
  }
  return null;
};
