import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";

export type STETHStakingAprData = {
  loading: boolean;
  currentApr: number;
  weeklyAvgApr: number;
};

export const defaultSTETHStakingAprData = {
  loading: true,
  currentApr: 0,
  weeklyAvgApr: 0,
};

export const useSTETHStakingApr = ({
  enabled = true,
}: { enabled?: boolean } = {}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>();

  const fetchSTETHStakingApr = useCallback(async () => {
    if (!enabled) {
      return;
    }

    if (data) {
      return;
    }

    const apiURL = `https://eth-api.lido.fi/v1/protocol/steth/apr/sma`;

    try {
      setLoading(true);
      const response = await axios.get(apiURL);
      const { data } = response;
      setData(data.data);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, [data, enabled]);

  useEffect(() => {
    fetchSTETHStakingApr();
  }, [fetchSTETHStakingApr]);

  const sTETHStakingAprData = useMemo(() => {
    if (!enabled) {
      return { ...defaultSTETHStakingAprData, loading: false };
    }

    if (loading || !data) {
      return defaultSTETHStakingAprData;
    }
    try {
      const currentApr = data.aprs.at(-1).apr;
      return {
        loading: false,
        currentApr,
        weeklyAvgApr: data.smaApr,
      } as STETHStakingAprData;
    } catch {
      return defaultSTETHStakingAprData;
    }
  }, [data, enabled, loading]);
  return sTETHStakingAprData;
};
