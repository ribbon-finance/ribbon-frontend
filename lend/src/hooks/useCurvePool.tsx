import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { CurvePool, CurvePool__factory } from "../codegen";
import { amountAfterSlippage } from "shared/lib/utils/math";
import { Assets } from "../store/types";
import {
  convertToUSDCAssets,
  getERC20TokenAddress,
} from "../constants/constants";
import { ERC20Token } from "shared/lib/models/eth";
import useLendPoolHelperContract from "./useLendPoolHelperContract";

export const getCurvePool = (curvePoolAddress: string, library: any) => {
  if (library) {
    const provider = library.getSigner();
    return CurvePool__factory.connect(curvePoolAddress, provider);
  }

  return undefined;
};

const useCurvePool = (asset: Assets) => {
  const { library, active } = useWeb3React();
  const [i, setI] = useState<BigNumber>();
  const [j, setJ] = useState<BigNumber>();
  const lendPoolHelper = useLendPoolHelperContract();
  const assetAddress = getERC20TokenAddress(
    asset.toLowerCase() as ERC20Token,
    1
  );

  const curvePoolDetails = useCallback(async () => {
    if (lendPoolHelper && convertToUSDCAssets.includes(asset)) {
      const { exchange, i, j } = await lendPoolHelper.swapData(assetAddress);
      return { curvePoolAddress: exchange, i, j };
    }
    return undefined;
  }, [asset, assetAddress, lendPoolHelper]);

  const [curvePool, setCurvePool] = useState<CurvePool>();

  useEffect(() => {
    curvePoolDetails().then((values) => {
      if (values) {
        const pool = getCurvePool(values.curvePoolAddress, library);
        setCurvePool(pool);
        setI(values.i);
        setJ(values.j);
      }
    });
  }, [active, curvePoolDetails, library]);

  // Get the exchange rate for converting stablecoin -> USDC
  // amountUSDC is usdc in 6 decimals
  // slippage is number between 0-1, 1 being 100% slippage
  const getMinUSDCAmount = useCallback(
    async (amountAsset: BigNumber, slippage: number = 0.005) => {
      if (curvePool && i && j) {
        // 1. Get usdc rate
        const usdcAmount = await curvePool.get_dy(i, j, amountAsset, {
          gasLimit: 400000,
        });
        // 2. Subtract 0.5% slippage to get min usdc
        const minUSDCAmount = amountAfterSlippage(usdcAmount, slippage);
        return minUSDCAmount;
      }
      return undefined;
    },
    [curvePool, i, j]
  );

  return {
    contract: curvePool,
    getMinUSDCAmount,
  };
};
export default useCurvePool;
