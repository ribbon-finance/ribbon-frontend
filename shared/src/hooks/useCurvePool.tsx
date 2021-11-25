import { BigNumber } from "@ethersproject/bignumber";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { CurveLiquidityPool } from "../codegen";
import { CurveLiquidityPoolFactory } from "../codegen/CurveLiquidityPoolFactory";
import {
  CurveSwapSlippage,
  LidoCurvePoolAddress,
} from "../constants/constants";
import { amountAfterSlippage } from "../utils/math";
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

export interface StETHSwapEstimate {
  swapOutput: BigNumber;
  swapOutputWithSlippage: BigNumber;
}

export const useCurvePoolEstimateStETHSwap = (
  getEstimate: Boolean,
  amount: BigNumber
): StETHSwapEstimate => {
  const { library } = useWeb3React();
  const { provider } = useWeb3Context();
  const [output, setOutput] = useState<StETHSwapEstimate>({
    swapOutput: BigNumber.from(0),
    swapOutputWithSlippage: BigNumber.from(0),
  });

  useEffect(() => {
    if (!getEstimate) {
      return;
    }

    const curvePool = getCurvePool(
      library || provider,
      LidoCurvePoolAddress,
      false
    );

    (async () => {
      if (amount.isZero()) return;
      const minOut = await curvePool.get_dy(1, 0, amount, { gasLimit: 300000 });
      setOutput({
        swapOutput: minOut,
        swapOutputWithSlippage: amountAfterSlippage(minOut, CurveSwapSlippage),
      });
    })();
  }, [library, provider]);

  return output;
};

export default useCurvePool;
