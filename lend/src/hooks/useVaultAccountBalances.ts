import { useEffect, useMemo, useState } from "react";
import { useVaultsData } from "./web3DataContext";
import { VaultList } from "../constants/constants";
import { BigNumber } from "ethers";
import useWeb3Wallet from "./useWeb3Wallet";

export type AccountBalances = {
  totalBalance: BigNumber;
  rbnEarned: BigNumber;
  rbnClaimed: BigNumber;
  rbnClaimable: BigNumber;
};

export const useVaultAccountBalances = () => {
  const [accountBalances, setAccountBalances] = useState<AccountBalances>({
    totalBalance: BigNumber.from(0.0),
    rbnEarned: BigNumber.from(0.0),
    rbnClaimed: BigNumber.from(0.0),
    rbnClaimable: BigNumber.from(0.0),
  });
  const { loading, data: vaultDatas } = useVaultsData();
  const { account } = useWeb3Wallet();

  useEffect(() => {
    if (!loading && account) {
      let totalBalance = BigNumber.from(0.0);
      let rbnEarned = BigNumber.from(0.0);
      let rbnClaimed = BigNumber.from(0.0);
      let rbnClaimable = BigNumber.from(0.0);
      VaultList.forEach((pool) => {
        const poolData = vaultDatas[pool];
        totalBalance = totalBalance.add(poolData.vaultBalanceInAsset);
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
  }, [account, loading, vaultDatas]);

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
