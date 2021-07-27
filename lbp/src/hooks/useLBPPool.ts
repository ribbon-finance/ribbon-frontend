import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";

import { LBPPool } from "shared/lib/codegen";
import { LBPPoolFactory } from "shared/lib/codegen/LBPPoolFactory";
import { RibbonTokenBalancerPoolAddress } from "shared/lib/constants/constants";
import { useWeb3Context } from "shared/lib/hooks/web3Context";

export const getLBPPool = (library: any, useSigner: boolean = true) => {
  const provider = useSigner ? library.getSigner() : library;

  return LBPPoolFactory.connect(RibbonTokenBalancerPoolAddress, provider);
};

type UseLBPPool = () => LBPPool | null;

const useLBPPool: UseLBPPool = () => {
  const { active, library } = useWeb3React();
  const { provider } = useWeb3Context();
  const [pool, setPool] = useState<LBPPool | null>(null);

  useEffect(() => {
    if (provider) {
      const vault = getLBPPool(library || provider, active);
      setPool(vault);
    }
  }, [active, library, provider]);

  return pool;
};
export default useLBPPool;
