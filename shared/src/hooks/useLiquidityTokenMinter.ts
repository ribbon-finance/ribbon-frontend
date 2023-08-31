import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";

import { LiquidityTokenMinter } from "../codegen/LiquidityTokenMinter";
import { LiquidityTokenMinterFactory } from "../codegen/LiquidityTokenMinterFactory";
import {
  isEthNetwork,
  LiquidityTokenMinterAddress,
} from "../constants/constants";
import { useETHWeb3Context, useWeb3Context } from "./web3Context";
import useWeb3Wallet from "./useWeb3Wallet";

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
  const { chainId, provider } = useWeb3React();
  const { active } = useWeb3Wallet();
  const { provider: defaultProvider } = useWeb3Context();
  const [contract, setContract] = useState<LiquidityTokenMinter | null>(null);

  useEffect(() => {
    if (active && chainId && isEthNetwork(chainId)) {
      setContract(getLiquidityTokenMinter(provider || defaultProvider, active));
      return;
    }

    setContract(getLiquidityTokenMinter(provider, false));
  }, [provider, chainId, active, defaultProvider]);

  return contract;
};

export default useLiquidityTokenMinter;
