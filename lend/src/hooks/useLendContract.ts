import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { RibbonLendPool } from "../codegen";
import { RibbonLendPool__factory } from "../codegen/factories/RibbonLendPool__factory";
import {
  PoolAddressMap,
  PoolOptions,
} from "shared/lib/constants/lendConstants";
import { useWeb3Context } from "shared/lib/hooks/web3Context";

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
  const { active, library } = useWeb3React();
  const { provider } = useWeb3Context();
  const [pool, setPool] = useState<RibbonLendPool | null>(null);

  useEffect(() => {
    const pool = getLendContract(library || provider, poolOption, active);
    setPool(pool);
  }, [active, library, provider, poolOption]);

  return pool;
};
export default useLendContract;
