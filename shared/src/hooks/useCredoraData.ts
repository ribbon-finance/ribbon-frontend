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
  creditScoreRating: "Inactive-Unrated",
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

    const apiURL = `https://platform.credora.io/api/v2/risk`;

    const headers = {
      headers: {
        clientId: process.env.REACT_APP_CREDORA_CLIENT_ID,
        clientSecret: process.env.REACT_APP_CREDORA_CLIENT_SECRET,
      },
    };

    const body = PoolList.map((pool) => {
      return getCredoraName(pool);
    });

    try {
      setLoading(true);
      const response = await axios.post(apiURL, body, headers);
      const { data } = response;
      const credoraData = Object.fromEntries(
        PoolList.map((pool) => {
          const fetchedData = data.find(
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
