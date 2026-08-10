import { useMemo } from "react";

import { LiquidityGaugeControllerFactory } from "../codegen/LiquidityGaugeControllerFactory";
import { LiquidityGaugeControllerAddress } from "../constants/constants";
import { useWeb3Context } from "./web3Context";

export const getLiquidityGaugeController = (
  library: any,
  useSigner: boolean = true
) => {
  const provider = useSigner ? library.getSigner() : library;

  return LiquidityGaugeControllerFactory.connect(
    LiquidityGaugeControllerAddress,
    provider
  );
};

const useLiquidityGaugeController = () => {
  const { provider: defaultProvider } = useWeb3Context();
  return useMemo(
    () => getLiquidityGaugeController(defaultProvider, false),
    [defaultProvider]
  );
};

export default useLiquidityGaugeController;
