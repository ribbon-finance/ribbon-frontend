import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";

import { LiquidityGaugeController } from "../codegen/LiquidityGaugeController";
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
  const { active, library } = useWeb3React();
  const { provider } = useWeb3Context();
  const [contract, setContract] = useState<LiquidityGaugeController | null>(
    null
  );

  useEffect(() => {
    if (provider) {
      setContract(getLiquidityGaugeController(library || provider, active));
    }
  }, [provider, active, library]);

  return contract;
};

export default useLiquidityGaugeController;
