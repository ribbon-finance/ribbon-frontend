import { useEffect, useMemo, useState } from "react";
import { SOR } from "@balancer-labs/sor";
import { useWeb3Context } from "shared/lib/hooks/web3Context";
import BigNumberJS from "bignumber.js";
import { isDevelopment } from "shared/lib/utils/env";
import { BalancerPoolUrls, LBPPoolUSDC } from "../constants/constants";
import { RibbonTokenAddress } from "shared/lib/constants/constants";

export const useLBPSor = () => {
  const { provider } = useWeb3Context();
  const [fetchCounter, setFetchCounter] = useState(0);

  const sor = useMemo(() => {
    return new SOR(
      provider,
      new BigNumberJS("100000000"),
      4,
      isDevelopment() ? 42 : 1,
      BalancerPoolUrls
    );
  }, [provider]);

  /**
   * Fetched pools
   */
  useEffect(() => {
    (async () => {
      await sor.fetchFilteredPairPools(LBPPoolUSDC, RibbonTokenAddress);
      await sor.fetchFilteredPairPools(RibbonTokenAddress, LBPPoolUSDC);
      setFetchCounter((counter) => counter + 1);
    })();
  }, [sor]);

  return { sor, fetchCounter };
};
