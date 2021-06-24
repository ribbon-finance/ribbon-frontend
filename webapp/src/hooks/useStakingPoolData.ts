import { BigNumber } from "@ethersproject/bignumber";
import { useWeb3React } from "@web3-react/core";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";

import {
  VaultLiquidityMiningMap,
  VaultOptions,
} from "shared/lib/constants/constants";
import { getERC20Token } from "shared/lib/hooks/useERC20Token";
import { useWeb3Context } from "shared/lib/hooks/web3Context";
import { StakingPoolData } from "../models/staking";
import { impersonateAddress } from "shared/lib/utils/development";
import { getStakingReward } from "./useStakingReward";

const initialData: StakingPoolData = {
  currentStake: BigNumber.from(0),
  poolSize: BigNumber.from(0),
  poolRewardForDuration: BigNumber.from(0),
  claimHistory: [],
  claimableRbn: BigNumber.from(0),
  unstakedBalance: BigNumber.from(0),
};

type UseStakingPoolData = (
  vault: VaultOptions,
  params?: {
    poll: boolean;
    pollingFrequency?: number;
  }
) => { data: StakingPoolData; loading: boolean };

const useStakingPoolData: UseStakingPoolData = (
  option,
  { poll, pollingFrequency } = { poll: true, pollingFrequency: 5000 }
) => {
  const [data, setData] = useState<StakingPoolData>(initialData);
  const [loading, setLoading] = useState(false);
  const [firstLoaded, setFirstLoaded] = useState(false);
  // const contract = useStakingReward(option);
  const web3Context = useWeb3React();
  const { provider } = useWeb3Context();
  const active = web3Context.active;
  const library = web3Context.library;
  const account = impersonateAddress ? impersonateAddress : web3Context.account;
  // const tokenContract = useERC20Token(option);

  const doMulticall = useCallback(async () => {
    const contract = getStakingReward(library || provider, option, active);
    const tokenContract = getERC20Token(library || provider, option, active);

    if (!contract || !tokenContract) {
      return;
    }

    if (!firstLoaded) {
      setLoading(true);
    }
    /**
     * 1. Pool size
     * 2. Pool reward of duration
     * 3. Last Time Reward Applicable
     * 4. Period finish
     */
    const unconnectedPromises = [
      tokenContract.balanceOf(VaultLiquidityMiningMap[option]),
      contract.getRewardForDuration(),
      contract.lastTimeRewardApplicable(),
      contract.periodFinish(),
    ];

    /**
     * 1. Current stake
     * 2. Claimable rbn
     * 3. Unstaked balance
     * 4. Claim Events
     */
    const promises = unconnectedPromises.concat(
      active
        ? [
            contract.balanceOf(account),
            contract.earned(account),
            tokenContract.balanceOf(account),
            contract.queryFilter(contract.filters.RewardPaid(account)),
          ]
        : [
            /** User had not connected their wallet, default to 0 */
            (async () => BigNumber.from(0))(),
            (async () => BigNumber.from(0))(),
            (async () => BigNumber.from(0))(),
            (async () => [])(),
          ]
    );

    const [
      poolSize,
      poolRewardForDuration,
      lastTimeRewardApplicable,
      periodFinish,
      currentStake,
      claimableRbn,
      unstakedBalance,
      claimEvents,
    ] = await Promise.all(promises);

    setData({
      poolSize,
      poolRewardForDuration,
      lastTimeRewardApplicable: lastTimeRewardApplicable.toString(),
      periodFinish: moment(periodFinish, "X").add(3, "days").unix().toString(),
      claimHistory: claimEvents.map((event: any) => ({
        amount: BigNumber.from(event.data),
      })),
      currentStake,
      claimableRbn,
      unstakedBalance,
    });

    if (!firstLoaded) {
      setLoading(false);
      setFirstLoaded(true);
    }
  }, [account, active, library, provider, option, firstLoaded]);

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

export default useStakingPoolData;
