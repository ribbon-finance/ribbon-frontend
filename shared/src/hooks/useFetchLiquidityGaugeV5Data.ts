import { useCallback, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";

import {
  defaultLiquidityGaugeV5PoolData,
  LiquidityGaugeV5PoolData,
  LiquidityGaugeV5PoolResponses,
} from "../models/staking";
import { impersonateAddress } from "../utils/development";
import { usePendingTransactions } from "./pendingTransactionsContext";
import { useWeb3Context } from "./web3Context";
import { isProduction } from "../utils/env";
import {
  isEthNetwork,
  VaultLiquidityMiningMap,
  VaultOptions,
} from "../constants/constants";
import { BigNumber } from "@ethersproject/bignumber";
import { getLiquidityGaugeV5 } from "./useLiquidityGaugeV5";
import { getV2VaultContract } from "./useV2VaultContract";
import useLiquidityTokenMinter from "./useLiquidityTokenMinter";
import useLiquidityGaugeController from "./useLiquidityGaugeController";
import { constants } from "ethers";
import { calculateClaimableRbn } from "../utils/governanceMath";

const useFetchLiquidityGaugeV5Data = (): LiquidityGaugeV5PoolData => {
  const { active, chainId, account: web3Account, library } = useWeb3React();
  const { provider } = useWeb3Context();
  const account = impersonateAddress ? impersonateAddress : web3Account;
  const { transactionsCounter } = usePendingTransactions();
  const minterContract = useLiquidityTokenMinter();
  const gaugeControllerContract = useLiquidityGaugeController();

  const [data, setData] = useState<LiquidityGaugeV5PoolData>(
    defaultLiquidityGaugeV5PoolData
  );
  const [, setMulticallCounter] = useState(0);

  const doMulticall = useCallback(async () => {
    if (
      !chainId ||
      !isEthNetwork(chainId) ||
      !minterContract ||
      !gaugeControllerContract
    ) {
      setData({
        ...defaultLiquidityGaugeV5PoolData,
        loading: false,
      });
      return;
    }

    if (!isProduction()) {
      console.time("Liquidity Gauge V5 Data Fetch"); // eslint-disable-line
    }

    /**
     * We keep track with counter so to make sure we always only update with the latest info
     */
    let currentCounter: number;
    setMulticallCounter((counter) => {
      currentCounter = counter + 1;
      return currentCounter;
    });

    // TODO: Make this chain agnostic, for now we only enable when user connected to ETH
    const minterResponsePromises = Promise.all([
      minterContract.rate(),
      gaugeControllerContract.time_total(),
    ]);
    const [rate, periodEndTime] = await minterResponsePromises;

    const gaugeResponsesPromises = Promise.all(
      Object.keys(VaultLiquidityMiningMap.lg5).map(async (_vault) => {
        const vault = _vault as VaultOptions;

        const lg5Contract = getLiquidityGaugeV5(
          library || provider,
          vault,
          active
        )!;
        const vaultContract = getV2VaultContract(
          library || provider,
          vault,
          active
        );

        /**
         * 1. Pool size
         * 2. Relative weight
         */
        const period = await lg5Contract.period();
        const isKilled = await lg5Contract.is_killed();
        const unconnectedPromises: Promise<BigNumber>[] = [
          lg5Contract.totalSupply(),
          lg5Contract.working_balances(account ?? constants.AddressZero),
          lg5Contract.working_supply(),
          gaugeControllerContract["gauge_relative_weight(address)"](
            VaultLiquidityMiningMap.lg5[vault]!
          ),

          // To calculate claimable rbn
          lg5Contract.period_timestamp(period),
          lg5Contract.integrate_inv_supply(period),
          lg5Contract.future_epoch_time(),
          lg5Contract.inflation_rate(),
        ];

        /**
         * 1. Current stake
         * 2. Unstaked Balance
         * 3. Integrate Fraction (total mintable $RBN over the lifetime. To get the claimable amount, take this value and minus the claimed RBN [minted])
         * 4. Claimed rbn
         */
        const promises = unconnectedPromises.concat(
          active
            ? [
                lg5Contract.balanceOf(account!),
                vaultContract!.shares(account!),
                lg5Contract.integrate_fraction(account!),
                minterContract.minted(
                  account!,
                  VaultLiquidityMiningMap.lg5[vault]!
                ),

                // To calculate claimable rbn
                lg5Contract.integrate_inv_supply_of(account!),
              ]
            : [
                // Default value when not connected
                Promise.resolve(BigNumber.from(0)),
                Promise.resolve(BigNumber.from(0)),
                Promise.resolve(BigNumber.from(0)),
                Promise.resolve(BigNumber.from(0)),
                Promise.resolve(BigNumber.from(0)),
                Promise.resolve(BigNumber.from(0)),
              ]
        );

        const [
          poolSize,
          workingBalances,
          workingSupply,
          relativeWeight,

          // Calculate claimable rbn
          periodTimestamp,
          integrateInvSupply,
          futureEpochTime,
          inflationRate,

          currentStake,
          unstakedBalance,
          integrateFraction,
          claimedRbn,

          // Also to calculate claimable rbn
          integrateInvSupplyOf,
        ] = await Promise.all(
          // Default to 0 when error
          promises.map((p) => p.catch((e) => BigNumber.from(0)))
        );

        const vaultAddress = VaultLiquidityMiningMap.lg5[vault];
        const claimableRbn = vaultAddress
          ? await calculateClaimableRbn({
              currentDate: new Date(),
              periodTimestamp: periodTimestamp.toNumber(),
              integrateInvSupply,
              integrateFraction,
              integrateInvSupplyOf,
              futureEpochTime: futureEpochTime.toNumber(),
              inflation_rate: inflationRate,
              minterRate: rate,
              isKilled,
              workingSupply,
              workingBalance: workingBalances,
              mintedRBN: claimedRbn,
              gaugeContractAddress: vaultAddress,
              gaugeControllerContract,
            })
          : BigNumber.from(0);

        return {
          vault,
          poolSize,
          workingBalances,
          workingSupply,
          relativeWeight,
          currentStake,
          unstakedBalance,
          claimedRbn,
          claimableRbn,
        };
      })
    );
    const guageResponses = await gaugeResponsesPromises;

    setMulticallCounter((counter) => {
      if (counter === currentCounter) {
        setData((prev) => ({
          responses: Object.fromEntries(
            guageResponses.map(
              ({ vault, relativeWeight, claimableRbn, ...response }) => {
                return [
                  vault,
                  {
                    ...prev.responses[vault],
                    claimableRbn,
                    poolRewardForDuration: rate
                      // Rate is RBN/second. There is 86400 is seconds in a day. Each period is 1 week.
                      .mul(86400 * 7)
                      .mul(relativeWeight)
                      // Relative weight is in percentage, but normalized to 1e18, so we need to divide it
                      .div(BigNumber.from(10).pow(18)),
                    periodEndTime: parseInt(periodEndTime.toString()),
                    ...response,
                  },
                ];
              }
            )
          ) as LiquidityGaugeV5PoolResponses,
          loading: false,
        }));
      }

      return counter;
    });

    if (!isProduction()) {
      console.timeEnd("Liquidity Gauge V5 Data Fetch"); // eslint-disable-line
    }
  }, [
    account,
    active,
    chainId,
    library,
    gaugeControllerContract,
    minterContract,
    provider,
  ]);

  useEffect(() => {
    doMulticall();
  }, [doMulticall, transactionsCounter]);

  return data;
};

export default useFetchLiquidityGaugeV5Data;
