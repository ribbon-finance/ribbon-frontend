import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { PoolFactory } from "../codegen";
import { PoolFactory__factory } from "../codegen/factories/PoolFactory__factory";
import { useWeb3Context } from "shared/lib/hooks/web3Context";
import deployment from "../constants/deployments.json";

export const getPoolFactoryContract = (
  library: any,
  useSigner: boolean = true
) => {
  const provider = useSigner ? library.getSigner() : library;

  return PoolFactory__factory.connect(deployment.mainnet.PoolFactory, provider);
};

const usePoolFactoryContract = () => {
  const { active, library } = useWeb3React();
  const { provider } = useWeb3Context();
  const [poolFactory, setPoolFactory] = useState<PoolFactory | null>(null);

  useEffect(() => {
    const poolFactory = getPoolFactoryContract(library || provider, active);
    setPoolFactory(poolFactory);
  }, [active, library, provider]);

  return poolFactory;
};
export default usePoolFactoryContract;
