import { useState } from "react";
import { useCallback, useEffect } from "react";

import { LBPPoolData } from "../models/lbp";
import useLBPPool from "./useLBPPool";

type UseLBPPoolData = (params?: {
  poll: boolean;
  pollingFrequency?: number;
}) => any;

const useLBPPoolData: UseLBPPoolData = (
  { poll, pollingFrequency } = { poll: true, pollingFrequency: 5000 }
) => {
  const [data, setData] = useState<LBPPoolData>();
  const [loading, setLoading] = useState(false);
  const [firstLoaded, setFirstLoaded] = useState(false);
  const pool = useLBPPool();

  const doMulticall = useCallback(async () => {
    if (!pool) {
      return;
    }

    if (!firstLoaded) {
      setLoading(true);
    }

    /**
     * 1. Spot price
     */
    // const unconnectedPromises = [];

    // try {
    //   const [spotPrice] = await Promise.all(unconnectedPromises);
    //   console.log(spotPrice);
    // } catch (err) {
    //   console.log(err);
    // }

    if (!firstLoaded) {
      setLoading(false);
      setFirstLoaded(true);
    }
  }, [pool, firstLoaded]);

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

  return { data, loading };
};

export default useLBPPoolData;
