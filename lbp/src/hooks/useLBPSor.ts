import { useCallback, useEffect, useMemo, useState } from "react";
import { SOR } from "@balancer-labs/sor";
import BigNumberJS from "bignumber.js";

import { useWeb3Context } from "shared/lib/hooks/web3Context";
import { isDevelopment } from "shared/lib/utils/env";
import { BalancerPoolUrls, RBNPurchaseToken } from "../constants/constants";
import {
  getERC20TokenAddress,
  RibbonTokenAddress,
} from "shared/lib/constants/constants";

type UseLBPSor = (params?: { poll: boolean; pollingFrequency?: number }) => {
  sor: SOR;
  fetchCounter: number;
};

export const useLBPSor: UseLBPSor = (
  { poll, pollingFrequency } = { poll: true, pollingFrequency: 5000 }
) => {
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
   * Fetch pools
   */
  const fetchPools = useCallback(async () => {
    await Promise.all(
      RBNPurchaseToken.flatMap((token) => [
        sor.fetchFilteredPairPools(
          getERC20TokenAddress(token),
          RibbonTokenAddress
        ),
        sor.fetchFilteredPairPools(
          RibbonTokenAddress,
          getERC20TokenAddress(token)
        ),
      ])
    );

    setFetchCounter((counter) => counter + 1);
  }, [sor]);

  /**
   * Initial fetch, and potentially look into regular update
   */
  useEffect(() => {
    let pollInterval: any = undefined;
    if (poll) {
      fetchPools();
      pollInterval = setInterval(fetchPools, pollingFrequency);
    } else {
      fetchPools();
    }

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [fetchPools, poll, pollingFrequency]);

  return { sor, fetchCounter };
};
