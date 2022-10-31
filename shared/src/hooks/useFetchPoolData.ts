import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { getLendContract } from "./getLendContract";
import { PoolList } from "../constants/constants";

export const useFetchPoolData = () => {
  const { library } = useWeb3React();
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const doMulticall = useCallback(async () => {
    const responses = await Promise.all(
      PoolList.map(async (pool) => {
        const contract = getLendContract(library, pool, false);

        if (!contract) {
          return { pool };
        }

        /**
         * 1. poolSize
         * 2. rewardPerSecond
         */
        const promises: Promise<BigNumber>[] = [
          contract.poolSize(),
          contract.rewardPerSecond(),
        ];

        const [poolSize, rewardPerSecond] = await Promise.all(
          // Default to 0 when error
          promises.map((p) =>
            p.catch((e) => {
              return BigNumber.from(0);
            })
          )
        );

        return {
          pool,
          poolSize,
          rewardPerSecond,
        };
      })
    );

    const mapping = Object.fromEntries(
      responses.map(({ pool, ...response }) => [
        pool,
        {
          pool,
          ...response,
        },
      ])
    );
    setData(mapping);
    setLoading(false);
  }, [library]);

  useEffect(() => {
    doMulticall();
  }, [doMulticall]);

  return {
    loading,
    data,
  };
};
