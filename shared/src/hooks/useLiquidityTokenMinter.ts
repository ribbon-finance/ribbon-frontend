import { useMemo } from "react";

import { LiquidityTokenMinterFactory } from "../codegen/LiquidityTokenMinterFactory";
import { LiquidityTokenMinterAddress } from "../constants/constants";
import { useWeb3Context } from "./web3Context";

export const getLiquidityTokenMinter = (
  library: any,
  useSigner: boolean = true
) => {
  const provider = useSigner ? library.getSigner() : library;

  return LiquidityTokenMinterFactory.connect(
    LiquidityTokenMinterAddress,
    provider
  );
};

const useLiquidityTokenMinter = () => {
  const { provider: defaultProvider } = useWeb3Context();
  return useMemo(
    () => getLiquidityTokenMinter(defaultProvider, false),
    [defaultProvider]
  );
};

export default useLiquidityTokenMinter;
