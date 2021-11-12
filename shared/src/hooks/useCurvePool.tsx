import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { CurveLiquidityPool } from "../codegen";
import { CurveLiquidityPoolFactory } from "../codegen/CurveLiquidityPoolFactory";
import { useWeb3Context } from "./web3Context";

export const getCurvePool = (
  library: any,
  address: string,
  useSigner: boolean = true
) => {
  const provider = useSigner ? library.getSigner() : library;

  const pool = CurveLiquidityPoolFactory.connect(address, provider);
  return pool;
};

const useCurvePool = (address: string) => {
  const { library, active } = useWeb3React();
  const { provider } = useWeb3Context();
  const [vault, setVault] = useState<CurveLiquidityPool | null>(null);

  useEffect(() => {
    const pool = getCurvePool(library || provider, address, active);
    setVault(pool);
  }, [active, address, library, provider]);

  return vault;
};
export default useCurvePool;
