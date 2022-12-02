import { useEffect, useMemo, useState } from "react";
import { usePoolsData } from "./web3DataContext";
import { PoolList } from "shared/lib/constants/lendConstants";
import { BigNumber } from "ethers";
import useWeb3Wallet from "./useWeb3Wallet";

export type AccountBalances = {
  totalBalance: BigNumber;
  rbnEarned: BigNumber;
  rbnClaimed: BigNumber;
  rbnClaimable: BigNumber;
};

export const usePoolAccountBalances = () => {
  const [accountBalances, setAccountBalances] = useState<AccountBalances>({
    totalBalance: BigNumber.from(0.0),
    rbnEarned: BigNumber.from(0.0),
    rbnClaimed: BigNumber.from(0.0),
    rbnClaimable: BigNumber.from(0.0),
  });
  const { loading, data: poolDatas } = usePoolsData();
  const { account } = useWeb3Wallet();

  useEffect(() => {
    if (!loading && account) {
      let totalBalance = BigNumber.from(0.0);
      let rbnEarned = BigNumber.from(0.0);
      let rbnClaimed = BigNumber.from(0.0);
      let rbnClaimable = BigNumber.from(0.0);
      PoolList.forEach((pool) => {
        const poolData = poolDatas[pool];
        totalBalance = totalBalance.add(poolData.poolBalanceInAsset);
        rbnEarned = rbnEarned.add(poolData.accumulativeReward);
        rbnClaimed = rbnClaimed.add(poolData.withdrawnReward);
        rbnClaimable = rbnClaimable.add(poolData.withdrawableReward);
      });
      setAccountBalances({
        totalBalance: totalBalance,
        rbnEarned: rbnEarned,
        rbnClaimed: rbnClaimed,
        rbnClaimable: rbnClaimable,
      });
    }
  }, [account, loading, poolDatas]);

  const isLoading = useMemo(() => {
    return loading || !account;
  }, [loading, account]);

  if (isLoading) {
    return {
      loading: isLoading,
      accountBalances: {
        totalBalance: BigNumber.from(0.0),
        rbnEarned: BigNumber.from(0.0),
        rbnClaimed: BigNumber.from(0.0),
        rbnClaimable: BigNumber.from(0.0),
      },
    };
  }

  return {
    loading: isLoading,
    accountBalances: accountBalances,
  };
};
