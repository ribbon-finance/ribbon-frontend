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
  RibbonTokenAddress,
  VaultLiquidityMiningMap,
  VaultOptions,
} from "../constants/constants";
import { BigNumber } from "@ethersproject/bignumber";
import { getLiquidityGaugeV5 } from "./useLiquidityGaugeV5";
import { getV2VaultContract } from "./useV2VaultContract";
import useLiquidityTokenMinter from "./useLiquidityTokenMinter";
import useLiquidityGaugeController from "./useLiquidityGaugeController";
import { constants } from "ethers";

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
      return;
    }

    if (!isProduction()) {
      console.time("Liquidity Gauge V5 Data Fetch");
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
        const unconnectedPromises: Promise<BigNumber>[] = [
          lg5Contract.totalSupply(),
          lg5Contract.working_balances(account ?? constants.AddressZero),
          lg5Contract.working_supply(),
          gaugeControllerContract["gauge_relative_weight(address)"](
            VaultLiquidityMiningMap.lg5[vault]!
          ),
        ];

        /**
         * 1. Current stake
         * 2. Claimable rbn
         * 3. Unstaked Balance
         * 4. Claimed rbn
         */
        const promises = unconnectedPromises.concat(
          active
            ? [
                lg5Contract.balanceOf(account!),
                lg5Contract.claimable_reward(account!, RibbonTokenAddress),
                vaultContract!.shares(account!),
                minterContract.minted(
                  account!,
                  VaultLiquidityMiningMap.lg5[vault]!
                ),
              ]
            : [
                // Default value when not connected
                Promise.resolve(BigNumber.from(0)),
                Promise.resolve(BigNumber.from(0)),
                Promise.resolve(BigNumber.from(0)),
                Promise.resolve(BigNumber.from(0)),
              ]
        );

        // Add minted amount (RBN Claimed)

        const [
          poolSize,
          workingBalances,
          workingSupply,
          relativeWeight,
          currentStake,
          claimableRbn,
          unstakedBalance,
          claimedRbn,
        ] = await Promise.all(
          // Default to 0 when error
          promises.map((p) => p.catch((e) => BigNumber.from(0)))
        );

        return {
          vault,
          poolSize,
          workingBalances,
          workingSupply,
          relativeWeight,
          currentStake,
          claimableRbn,
          unstakedBalance,
          claimedRbn,
        };
      })
    );

    const guageResponses = await gaugeResponsesPromises;
    const [rate, periodEndTime] = await minterResponsePromises;

    setMulticallCounter((counter) => {
      if (counter === currentCounter) {
        setData((prev) => ({
          responses: Object.fromEntries(
            guageResponses.map(({ vault, relativeWeight, ...response }) => [
              vault,
              {
                ...prev.responses[vault],
                poolRewardForDuration: rate
                  .mul(relativeWeight)
                  // Relative weight is in percentage, but normalized to 1e18, so we need to divide it
                  .div(BigNumber.from(10).pow(18)),
                periodEndTime: parseInt(periodEndTime.toString()),
                ...response,
              },
            ])
          ) as LiquidityGaugeV5PoolResponses,
          loading: false,
        }));
      }

      return counter;
    });

    if (!isProduction()) {
      console.timeEnd("Liquidity Gauge V5 Data Fetch");
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
