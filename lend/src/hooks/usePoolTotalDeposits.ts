import { useEffect, useMemo, useState } from "react";
import { PoolList } from "shared/lib/constants/lendConstants";
import { BigNumber } from "ethers";
import usePoolAccounts from "./usePoolAccounts";

export const usePoolTotalDeposits = () => {
  const [totalDeposits, setTotalDeposits] = useState<BigNumber>(
    BigNumber.from(0.0)
  );

  const { loading, poolAccounts } = usePoolAccounts("lend");

  useEffect(() => {
    if (!loading && poolAccounts) {
      try {
        let deposits = BigNumber.from(0.0);
        PoolList.forEach((pool) => {
          const poolAccount = poolAccounts[pool];
          if (poolAccount) {
            deposits = deposits.add(poolAccount.totalDeposits);
          }
        });
        setTotalDeposits(deposits);
      } catch (error) {
        console.log("error", error);
      }
    }
  }, [loading, poolAccounts]);

  const isLoading = useMemo(() => {
    return loading || !poolAccounts;
  }, [loading, poolAccounts]);

  if (isLoading) {
    return {
      loading: isLoading,
      totalDeposits: BigNumber.from(0.0),
    };
  }

  return {
    loading: isLoading,
    totalDeposits,
  };
};
