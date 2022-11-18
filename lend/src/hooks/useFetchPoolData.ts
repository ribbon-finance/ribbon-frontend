import { BigNumber } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";

import { useWeb3Context } from "./web3Context";
import { getLendContract } from "./useLendContract";
import { PoolList } from "shared/lib/constants/lendConstants";
import { impersonateAddress } from "shared/lib/utils/development";
import { defaultPoolData, PoolData, PoolDataResponses } from "../models/pool";
import { isProduction } from "../utils/env";
import { usePendingTransactions } from "./pendingTransactionsContext";
import { isPoolSupportedOnChain } from "../utils/pool";

const useFetchPoolData = (): PoolData => {
  const {
    chainId,
    library,
    active: web3Active,
    account: web3Account,
  } = useWeb3React();

  const { provider } = useWeb3Context();
  const account = impersonateAddress ? impersonateAddress : web3Account;
  const { transactionsCounter } = usePendingTransactions();

  const [data, setData] = useState<PoolData>(defaultPoolData);
  const [, setMulticallCounter] = useState(0);

  const doMulticall = useCallback(async () => {
    if (!isProduction()) {
      console.time("V1 Pool Data Fetch"); // eslint-disable-line
    }

    /**
     * We keep track with counter so to make sure we always only update with the latest info
     */
    let currentCounter: number;
    setMulticallCounter((counter) => {
      currentCounter = counter + 1;
      return currentCounter;
    });

    const responses = await Promise.all(
      PoolList.map(async (pool) => {
        // If we don't support the pool on the chainId, we just return the inactive data state
        const active = Boolean(
          web3Active && isPoolSupportedOnChain(pool, chainId || 1)
        );

        const contract = getLendContract(library || provider, pool, active);

        if (!contract) {
          return { pool };
        }

        /**
         * 1. Total Balance
         * 2. Utilization Rate
         * 3. max Withdrawable Shares
         * 4. Total Supply
         */
        const unconnectedPromises: Promise<any>[] = [
          contract.poolSize(),
          contract.availableToWithdraw(),
          contract.getUtilizationRate(),
          contract.availableToWithdraw(),
          contract.availableToBorrow(),
          contract.getCurrentExchangeRate(),
          contract.totalSupply(),
          contract.getSupplyRate(),
          contract.rewardPerSecond(),
          contract.manager(),
          contract.borrows(),
          contract.reserveFactor(),
        ];

        /**
         * 1. Pool balance in asset
         */
        const promises = unconnectedPromises.concat(
          active
            ? [
                contract.balanceOf(account!),
                contract.accumulativeRewardOf(account!),
                contract.withdrawableRewardOf(account!),
                contract.withdrawnRewardOf(account!),
              ]
            : [
                // Default value when not connected
                Promise.resolve(BigNumber.from(0)),
                Promise.resolve(BigNumber.from(0)),
                Promise.resolve(BigNumber.from(0)),
                Promise.resolve(BigNumber.from(0)),
              ]
        );

        const [
          poolSize,
          availableToWithdraw,
          utilizationRate,
          poolMaxWithdrawableShares,
          availableToBorrow,
          currentExchangeRate,
          totalSupply,
          supplyRate,
          rewardPerSecond,
          manager,
          borrows,
          reserveFactor,
          poolBalance,
          accumulativeReward,
          withdrawableReward,
          withdrawnReward,
        ] = await Promise.all(
          promises.map((p) => p.catch((e) => BigNumber.from(0)))
        );

        return {
          pool,
          poolSize,
          availableToWithdraw,
          utilizationRate,
          poolMaxWithdrawableShares,
          availableToBorrow,
          currentExchangeRate,
          totalSupply,
          supplyRate,
          rewardPerSecond,
          manager,
          borrows,
          reserveFactor,
          poolBalance,
          accumulativeReward,
          withdrawableReward,
          withdrawnReward,
        };
      })
    );

    setMulticallCounter((counter) => {
      if (counter === currentCounter) {
        setData((prev) => ({
          responses: Object.fromEntries(
            responses.map(
              ({
                pool,
                availableToWithdraw,
                utilizationRate,
                poolMaxWithdrawableShares,
                availableToBorrow,
                currentExchangeRate,
                totalSupply,
                supplyRate,
                rewardPerSecond,
                manager,
                borrows,
                reserveFactor,
                accumulativeReward,
                withdrawableReward,
                withdrawnReward,
                ...response
              }) => [
                pool,
                {
                  ...prev.responses[pool],
                  ...response,
                  availableToWithdraw: availableToWithdraw,
                  utilizationRate: utilizationRate,
                  supplyRate: supplyRate,
                  rewardPerSecond: rewardPerSecond,
                  manager: manager,
                  borrows: borrows,
                  reserveFactor: reserveFactor,
                  availableToBorrow: availableToBorrow,
                  currentExchangeRate: currentExchangeRate,
                  accumulativeReward: accumulativeReward,
                  withdrawableReward: withdrawableReward,
                  withdrawnReward: withdrawnReward,
                  poolBalanceInAsset:
                    response.poolBalance && currentExchangeRate
                      ? currentExchangeRate
                          .mul(response.poolBalance)
                          .div(BigNumber.from(10).pow(18))
                      : BigNumber.from(0),
                  poolMaxWithdrawAmount:
                    totalSupply &&
                    poolMaxWithdrawableShares &&
                    response.poolSize &&
                    !totalSupply.isZero()
                      ? poolMaxWithdrawableShares
                          .mul(response.poolSize)
                          .div(totalSupply)
                      : BigNumber.from(0),
                },
              ]
            )
          ) as PoolDataResponses,
          loading: false,
        }));
      }

      return counter;
    });

    if (!isProduction()) {
      console.timeEnd("Pool Data Fetch"); // eslint-disable-line
    }
  }, [account, web3Active, library, provider, chainId]);

  useEffect(() => {
    doMulticall();
  }, [doMulticall, transactionsCounter]);

  return data;
};

export default useFetchPoolData;
