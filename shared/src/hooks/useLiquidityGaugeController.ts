import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";

import { LiquidityGaugeController } from "../codegen/LiquidityGaugeController";
import { LiquidityGaugeControllerFactory } from "../codegen/LiquidityGaugeControllerFactory";
import { LiquidityGaugeControllerAddress } from "../constants/constants";
import { useWeb3Context } from "./web3Context";
import useWeb3Wallet from "./useWeb3Wallet";

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
  const { provider } = useWeb3React();
  const { active } = useWeb3Wallet();
  const { provider: defaultProvider } = useWeb3Context();
  const [contract, setContract] = useState<LiquidityGaugeController | null>(
    null
  );

  useEffect(() => {
    if (provider) {
      setContract(
        getLiquidityGaugeController(provider || defaultProvider, active)
      );
    }
  }, [provider, active, defaultProvider]);

  return contract;
};

export default useLiquidityGaugeController;
