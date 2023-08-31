import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { CurveLidoPool, CurveLidoPool__factory } from "../codegen";
import { CurveLidoPoolAddress } from "../constants/constants";
import { amountAfterSlippage } from "../utils/math";
import useWeb3Wallet from "./useWeb3Wallet";
import { useWeb3Context } from "./web3Context";

export const getLidoCurvePool = (library: any) => {
  if (library) {
    const provider = library.getSigner();
    return CurveLidoPool__factory.connect(CurveLidoPoolAddress, provider);
  }

  return undefined;
};

const useLidoCurvePool = () => {
  const { provider } = useWeb3React();
  const { active } = useWeb3Wallet();
  const { provider: defaultProvider } = useWeb3Context();
  const [lidoCurvePool, setLidoCurvePool] = useState<CurveLidoPool>();

  useEffect(() => {
    const pool = getLidoCurvePool(provider || defaultProvider);
    setLidoCurvePool(pool);
  }, [active, defaultProvider, provider]);

  // Get the exchange rate for converting ETH -> stETH
  // amountETH is eth in 18 decimals
  // slippage is number between 0-1, 1 being 100% slippage
  const getMinSTETHAmount = useCallback(
    async (amountETH: BigNumber, slippage: number = 0.005) => {
      if (lidoCurvePool) {
        // 1. Get steth rate
        const stETHAmount = await lidoCurvePool.get_dy(0, 1, amountETH, {
          gasLimit: 400000,
        });
        // 2. Subtract 0.5% slippage to get min steth
        const minSTETHAmount = amountAfterSlippage(stETHAmount, slippage);
        return minSTETHAmount;
      }
      return undefined;
    },
    [lidoCurvePool]
  );

  return {
    contract: lidoCurvePool,
    getMinSTETHAmount,
  };
};
export default useLidoCurvePool;
