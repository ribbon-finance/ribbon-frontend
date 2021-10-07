import { useCallback, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { BigNumber, Event } from "ethers";
import moment from "moment";

import { VaultLiquidityMiningMap, VaultList } from "../constants/constants";
import { impersonateAddress } from "../utils/development";
import { useWeb3Context } from "./web3Context";
import { isProduction } from "../utils/env";
import {
  defaultStakingPoolData,
  StakingPoolData,
  StakingPoolResponses,
} from "../models/staking";
import { getERC20Token } from "./useERC20Token";
import { getStakingReward } from "./useStakingReward";

const useFetchStakingPoolData = (
  {
    poll,
    pollingFrequency,
  }: {
    poll: boolean;
    pollingFrequency: number;
  } = { poll: true, pollingFrequency: 20000 }
): StakingPoolData => {
  const { active, account: web3Account, library } = useWeb3React();
  const { provider } = useWeb3Context();
  const account = impersonateAddress ? impersonateAddress : web3Account;

  const [data, setData] = useState<StakingPoolData>(defaultStakingPoolData);

  const doMulticall = useCallback(async () => {
    if (!isProduction()) {
      console.time("Staking Pool Data Fetch");
    }

    const responses = await Promise.all(
      VaultList.map(async (vault) => {
        const contract = getStakingReward(library || provider, vault, active);
        const tokenContract = getERC20Token(library || provider, vault, active);
        if (!contract || !tokenContract || !VaultLiquidityMiningMap[vault]) {
          return { vault };
        }

        /**
         * 1. Pool size
         * 2. Pool reward of duration
         * 3. Last Time Reward Applicable
         * 4. Period finish
         */
        const unconnectedPromises: Promise<BigNumber | Event[] | number>[] = [
          tokenContract.balanceOf(VaultLiquidityMiningMap[vault]!),
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
                // Default value when not connected
                Promise.resolve(BigNumber.from(0)),
                Promise.resolve(BigNumber.from(0)),
                Promise.resolve(BigNumber.from(0)),
                Promise.resolve([]),
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
        ] = await Promise.all(
          // Default to 0 when error
          promises.map((p) => p.catch((e) => BigNumber.from(0)))
        );

        return {
          vault,
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
        };
      })
    );

    setData((prev) => ({
      responses: Object.fromEntries(
        responses.map(({ vault, ...response }) => [
          vault,
          {
            ...prev.responses[vault],
            ...response,
          },
        ])
      ) as StakingPoolResponses,
      loading: false,
    }));

    if (!isProduction()) {
      console.timeEnd("Staking Pool Data Fetch");
    }
  }, [account, active, library, provider]);

  useEffect(() => {
    let pollInterval: any = undefined;
    doMulticall();

    if (poll) {
      pollInterval = setInterval(doMulticall, pollingFrequency);
    }

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [doMulticall, poll, pollingFrequency]);

  return data;
};

export default useFetchStakingPoolData;
