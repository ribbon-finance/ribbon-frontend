import axios from "axios";
import { useCallback, useEffect, useState } from "react";

// export type PoolsCredoraData = {
//   [pool in PoolOptions]: {
//     loading: boolean;
//     creditScoreRating: string;
//     borrowCapacity: number;
//   };
// };

// export const defaultPoolCredoraData = {
//   loading: true,
//   creditScoreRating: "UNRATED",
//   borrowCapacity: 0,
// };

// export const defaultPoolsCredoraData = Object.fromEntries(
//   PoolList.map((pool) => [pool, defaultPoolCredoraData])
// ) as PoolsCredoraData;

export const useSTETHStakingApr = () => {
  const [loading, setLoading] = useState(false);
  const [apr, setApr] = useState<number>();

  const fetchSTETHStakingApr = useCallback(async () => {
    if (apr) {
      return;
    }

    const apiURL = `https://eth-api.lido.fi/v1/protocol/steth/apr/sma`;

    try {
      setLoading(true);
      const response = await axios.get(apiURL);
      const { data } = response;
      setApr(data.data.smaApr);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, [apr]);

  useEffect(() => {
    fetchSTETHStakingApr();
  }, [fetchSTETHStakingApr]);

  return {
    stakingApr: apr || 0,
    loading,
  };
};
