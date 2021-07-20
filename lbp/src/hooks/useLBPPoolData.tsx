import { useState } from "react";
import { useCallback, useEffect } from "react";

import { RibbonTokenAddress } from "shared/lib/constants/constants";
import useLBPPool from "./useLBPPool";
import { useLBPGlobalState } from "../store/store";
import { LBPPoolInitialBalance, LBPPoolUSDC } from "../constants/constants";
import { LBPPoolData } from "../models/lbp";

type UseLBPPoolData = (params?: {
  poll: boolean;
  pollingFrequency?: number;
}) => { data: LBPPoolData | undefined; loading: boolean };

const useLBPPoolData: UseLBPPoolData = (
  { poll, pollingFrequency } = { poll: true, pollingFrequency: 5000 }
) => {
  const [poolData, setPoolData] = useLBPGlobalState("lbpPoolData");
  const [loading, setLoading] = useState(false);
  const contract = useLBPPool();

  const doMulticall = useCallback(async () => {
    if (!contract) {
      return;
    }

    if (!poolData.fetched) {
      setLoading(true);
    }

    /**
     * 1. Spot price
     * 2. USDC Balance
     * 3. Ribbon Balance
     */
    const unconnectedPromises = [
      contract.getSpotPrice(LBPPoolUSDC, RibbonTokenAddress),
      contract.getBalance(LBPPoolUSDC),
      contract.getBalance(RibbonTokenAddress),
      contract.getSwapFee(),
    ];

    const [spotPrice, usdcBalance, ribbonBalance] = await Promise.all(
      unconnectedPromises
    );

    setPoolData({
      fetched: true,
      data: {
        spotPrice,
        ribbonSold: LBPPoolInitialBalance.ribbon.sub(ribbonBalance),
        usdcRaised: usdcBalance.sub(LBPPoolInitialBalance.usdc),
      },
    });

    setLoading(false);
  }, [contract, poolData.fetched, setPoolData]);

  useEffect(() => {
    let pollInterval: any = undefined;
    if (poll) {
      doMulticall();
      pollInterval = setInterval(doMulticall, pollingFrequency);
    } else {
      doMulticall();
    }

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [poll, pollingFrequency, doMulticall]);

  return { data: poolData.data, loading };
};

export default useLBPPoolData;
