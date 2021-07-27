import { useState } from "react";
import { useCallback, useEffect } from "react";

import {
  getERC20TokenAddress,
  RibbonTokenAddress,
} from "shared/lib/constants/constants";
import useLBPPool from "./useLBPPool";
import { useLBPGlobalState } from "../store/store";
import {
  LBPPoolInitialBalance,
  RBNPurchaseToken,
} from "../constants/constants";
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
     * 1. Spot price with default purchase token
     * 2. Default purcahse token balance
     * 3. Ribbon Balance
     * 4. Swap fees
     */
    const unconnectedPromises = [
      contract.getSpotPrice(
        getERC20TokenAddress(RBNPurchaseToken[0]),
        RibbonTokenAddress
      ),
      contract.getBalance(getERC20TokenAddress(RBNPurchaseToken[0])),
      contract.getBalance(RibbonTokenAddress),
      contract.getSwapFee(),
    ];

    const [spotPrice, usdcBalance, ribbonBalance, swapFees] = await Promise.all(
      unconnectedPromises
    );

    setPoolData({
      fetched: true,
      data: {
        spotPrice,
        ribbonSold: LBPPoolInitialBalance.ribbon.sub(ribbonBalance),
        usdcRaised: usdcBalance.sub(LBPPoolInitialBalance.usdc),
        swapFees,
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
