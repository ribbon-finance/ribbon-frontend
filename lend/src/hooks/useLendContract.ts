import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { RibbonLendPool } from "../codegen";
import { RibbonLendPool__factory } from "../codegen/factories/RibbonLendPool__factory";
import {
  PoolAddressMap,
  PoolOptions,
} from "shared/lib/constants/lendConstants";
import { useWeb3Context } from "shared/lib/hooks/web3Context";
import useWeb3Wallet from "./useWeb3Wallet";

export const getLendContract = (
  library: any,
  poolOption: PoolOptions,
  useSigner: boolean = true
) => {
  const provider = useSigner ? library.getSigner() : library;

  return RibbonLendPool__factory.connect(
    PoolAddressMap[poolOption].lend,
    provider
  );
};

const useLendContract = (poolOption: PoolOptions) => {
  const { provider } = useWeb3React();
  const { active } = useWeb3Wallet();
  const { provider: defaultProvider } = useWeb3Context();
  const [pool, setPool] = useState<RibbonLendPool | null>(null);

  useEffect(() => {
    const pool = getLendContract(
      provider || defaultProvider,
      poolOption,
      active
    );
    setPool(pool);
  }, [active, provider, poolOption, defaultProvider]);

  return pool;
};
export default useLendContract;
