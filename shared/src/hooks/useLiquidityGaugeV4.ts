import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";

import { LiquidityGaugeV4 } from "../codegen";
import { LiquidityGaugeV4Factory } from "../codegen/LiquidityGaugeV4Factory";
import { VaultLiquidityMiningMap, VaultOptions } from "../constants/constants";
import { useWeb3Context } from "./web3Context";

export const getLiquidityGaugeV4 = (
  library: any,
  vaultOption: VaultOptions,
  useSigner: boolean = true
) => {
  const provider = useSigner ? library.getSigner() : library;

  if (!VaultLiquidityMiningMap.lg4[vaultOption]) {
    return null;
  }

  return LiquidityGaugeV4Factory.connect(
    VaultLiquidityMiningMap.lg4[vaultOption]!,
    provider
  );
};

const useLiquidityGaugeV4 = (vaultOption: VaultOptions) => {
  const { active, library } = useWeb3React();
  const { provider } = useWeb3Context();
  const [contract, setContract] = useState<LiquidityGaugeV4 | null>(null);

  useEffect(() => {
    if (provider) {
      const vault = getLiquidityGaugeV4(
        library || provider,
        vaultOption,
        active
      );
      setContract(vault);
    }
  }, [provider, active, library, vaultOption]);

  return contract;
};

export default useLiquidityGaugeV4;
