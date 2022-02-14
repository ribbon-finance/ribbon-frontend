import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";

import { LiquidityTokenMinter } from "../codegen/LiquidityTokenMinter";
import { LiquidityTokenMinterFactory } from "../codegen/LiquidityTokenMinterFactory";
import {
  isEthNetwork,
  LiquidityTokenMinterAddress,
} from "../constants/constants";
import { useETHWeb3Context } from "./web3Context";

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
  const { active, chainId, library } = useWeb3React();
  const { provider } = useETHWeb3Context();
  const [contract, setContract] = useState<LiquidityTokenMinter | null>(null);

  useEffect(() => {
    if (active && chainId && isEthNetwork(chainId)) {
      setContract(getLiquidityTokenMinter(library, active));
      return;
    }

    setContract(getLiquidityTokenMinter(provider, false));
  }, [provider, chainId, active, library]);

  return contract;
};

export default useLiquidityTokenMinter;
