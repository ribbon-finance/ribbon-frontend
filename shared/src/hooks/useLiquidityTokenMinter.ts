import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";

import { LiquidityTokenMinter } from "../codegen/LiquidityTokenMinter";
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
  const { active, library } = useWeb3React();
  const { provider } = useWeb3Context();
  const [contract, setContract] = useState<LiquidityTokenMinter | null>(null);

  useEffect(() => {
    if (provider) {
      setContract(getLiquidityTokenMinter(library || provider, active));
    }
  }, [provider, active, library]);

  return contract;
};

export default useLiquidityTokenMinter;
