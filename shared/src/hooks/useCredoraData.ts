import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import {
  getCredoraName,
  PoolList,
  PoolOptions,
} from "../constants/lendConstants";

export type PoolsCredoraData = {
  [pool in PoolOptions]: {
    loading: boolean;
    creditScoreRating: string;
    borrowCapacity: number;
  };
};

export const defaultPoolCredoraData = {
  loading: true,
  creditScoreRating: "UNRATED",
  borrowCapacity: 0,
};

export const defaultPoolsCredoraData = Object.fromEntries(
  PoolList.map((pool) => [pool, defaultPoolCredoraData])
) as PoolsCredoraData;

export const useCredoraData = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PoolsCredoraData>();

  const fetchCredoraData = useCallback(async () => {
    if (data) {
      return;
    }

    const apiURL = `https://api-ribbon.vercel.app/api/credora`;

    try {
      setLoading(true);
      const response = await axios.get(apiURL);
      const { data } = response;
      const credoraData = Object.fromEntries(
        PoolList.map((pool) => {
          const fetchedData = data.data.find(
            (object: any) => object.cpUsername === getCredoraName(pool)
          );
          if (!fetchedData) {
            return [pool, defaultPoolCredoraData];
          }
          return [
            pool,
            {
              loading: false,
              creditScoreRating: fetchedData.creditScoreRating,
              borrowCapacity: fetchedData.borrowCapacity,
            },
          ];
        })
      ) as PoolsCredoraData;
      setData(credoraData);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, [data]);

  useEffect(() => {
    fetchCredoraData();
  }, [fetchCredoraData]);

  return {
    data: data || defaultPoolsCredoraData,
    loading,
  };
};
