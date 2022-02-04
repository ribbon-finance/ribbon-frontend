import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";

import { LiquidityGaugeV5 } from "../codegen";
import { LiquidityGaugeV5Factory } from "../codegen/LiquidityGaugeV5Factory";
import { VaultLiquidityMiningMap, VaultOptions } from "../constants/constants";
import { useWeb3Context } from "./web3Context";

export const getLiquidityGaugeV5 = (
  library: any,
  vaultOption: VaultOptions,
  useSigner: boolean = true
) => {
  const provider = useSigner ? library.getSigner() : library;

  if (!VaultLiquidityMiningMap.lg5[vaultOption]) {
    return null;
  }

  return LiquidityGaugeV5Factory.connect(
    VaultLiquidityMiningMap.lg5[vaultOption]!,
    provider
  );
};

const useLiquidityGaugeV5 = (vaultOption: VaultOptions) => {
  const { active, library } = useWeb3React();
  const { provider } = useWeb3Context();
  const [contract, setContract] = useState<LiquidityGaugeV5 | null>(null);

  useEffect(() => {
    if (provider) {
      const vault = getLiquidityGaugeV5(
        library || provider,
        vaultOption,
        active
      );
      setContract(vault);
    }
  }, [provider, active, library, vaultOption]);

  return contract;
};

export default useLiquidityGaugeV5;
