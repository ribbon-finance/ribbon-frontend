import { BigNumber } from "@ethersproject/bignumber";
import { useWeb3React } from "@web3-react/core";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { Event } from "@ethersproject/contracts";

import { StakingPoolData } from "../models/staking";
import useStakingReward from "./useStakingReward";
import { VaultLiquidityMiningMap, VaultOptions } from "../constants/constants";
import { useWeb3Context } from "./web3Context";
import { getERC20Token } from "./useERC20Token";
import { impersonateAddress } from "../utils/development";

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
  // TODO: Global state
  const [data, setData] = useState<StakingPoolData>(initialData);
  const [loading, setLoading] = useState(false);
  const [firstLoaded, setFirstLoaded] = useState(false);
  const { active, library, account: web3Account } = useWeb3React();
  const { provider } = useWeb3Context();
  const account = impersonateAddress ? impersonateAddress : web3Account;
  const contract = useStakingReward(option);

  const doMulticall = useCallback(async () => {
    const tokenContract = getERC20Token(library || provider, option, active);

    if (!contract || !tokenContract || !VaultLiquidityMiningMap[option]) {
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
    const unconnectedPromises: Promise<BigNumber | Array<Event> | number>[] = [
      tokenContract.balanceOf(VaultLiquidityMiningMap[option]!),
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
            contract.balanceOf(account!),
            contract.earned(account!),
            tokenContract.balanceOf(account!),
            contract.queryFilter(
              contract.filters.RewardPaid(account as string, null)
            ),
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
      poolSize: poolSize as BigNumber,
      poolRewardForDuration: poolRewardForDuration as BigNumber,
      lastTimeRewardApplicable: lastTimeRewardApplicable.toString(),
      periodFinish: moment(periodFinish as number, "X")
        .add(1, "days")
        .unix()
        .toString(),
      claimHistory: (claimEvents as Event[]).map((event: any) => ({
        amount: BigNumber.from(event.data),
      })),
      currentStake: currentStake as BigNumber,
      claimableRbn: claimableRbn as BigNumber,
      unstakedBalance: unstakedBalance as BigNumber,
    });

    if (!firstLoaded) {
      setLoading(false);
      setFirstLoaded(true);
    }
  }, [account, active, contract, library, provider, option, firstLoaded]);

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
