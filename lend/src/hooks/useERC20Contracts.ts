import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { ERC20Balance } from "../codegen";
import { ERC20Balance__factory } from "../codegen/factories/ERC20Balance__factory";
import { useWeb3Context } from "shared/lib/hooks/web3Context";
import deployment from "../constants/deployments.json";
import useWeb3Wallet from "./useWeb3Wallet";

export const getRibbonContract = (library: any, useSigner: boolean = true) => {
  const provider = useSigner ? library.getSigner() : library;

  return ERC20Balance__factory.connect(
    deployment.mainnet.ribbontoken,
    provider
  );
};

export const getUSDCContract = (library: any, useSigner: boolean = true) => {
  const provider = useSigner ? library.getSigner() : library;

  return ERC20Balance__factory.connect(deployment.mainnet.usdctoken, provider);
};

const useERC20Contracts = () => {
  const { provider } = useWeb3React();
  const { active } = useWeb3Wallet();
  const { provider: defaultProvider } = useWeb3Context();
  const [ribbonToken, setRibbonToken] = useState<ERC20Balance | null>(null);
  const [usdcToken, setUSDCToken] = useState<ERC20Balance | null>(null);

  useEffect(() => {
    const ribbonToken = getRibbonContract(provider || defaultProvider, active);
    setRibbonToken(ribbonToken);
    const usdcToken = getUSDCContract(provider || defaultProvider, active);
    setUSDCToken(usdcToken);
  }, [active, defaultProvider, provider]);

  return {
    ribbonToken,
    usdcToken,
  };
};
export default useERC20Contracts;
