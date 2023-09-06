import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { PoolFactory } from "../codegen";
import { PoolFactory__factory } from "../codegen/factories/PoolFactory__factory";
import { useWeb3Context } from "shared/lib/hooks/web3Context";
import deployment from "../constants/deployments.json";
import useWeb3Wallet from "./useWeb3Wallet";

export const getPoolFactoryContract = (
  library: any,
  useSigner: boolean = true
) => {
  const provider = useSigner ? library.getSigner() : library;

  return PoolFactory__factory.connect(deployment.mainnet.poolfactory, provider);
};

const usePoolFactoryContract = () => {
  const { provider } = useWeb3React();
  const { active } = useWeb3Wallet();
  const { provider: defaultProvider } = useWeb3Context();
  const [poolFactory, setPoolFactory] = useState<PoolFactory | null>(null);

  useEffect(() => {
    const poolFactory = getPoolFactoryContract(
      provider || defaultProvider,
      active
    );
    setPoolFactory(poolFactory);
  }, [active, defaultProvider, provider]);

  return poolFactory;
};
export default usePoolFactoryContract;
