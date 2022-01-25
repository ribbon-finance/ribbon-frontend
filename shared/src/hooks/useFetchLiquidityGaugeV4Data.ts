import { useCallback, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";

import {
  defaultLiquidityGaugeV4PoolData,
  LiquidityGaugeV4PoolData,
  LiquidityGaugeV4PoolResponses,
} from "../models/staking";
import { impersonateAddress } from "../utils/development";
import { usePendingTransactions } from "./pendingTransactionsContext";
import { useWeb3Context } from "./web3Context";
import { isProduction } from "../utils/env";
import {
  RibbonTokenAddress,
  VaultLiquidityMiningMap,
  VaultOptions,
} from "../constants/constants";
import { BigNumber } from "@ethersproject/bignumber";
import { getLiquidityGaugeV4 } from "./useLiquidityGaugeV4";
import { getERC20Token } from "./useERC20Token";
import { getERC20TokenNameFromVault } from "../models/eth";

const useFetchLiquidityGaugeV4Data = (): LiquidityGaugeV4PoolData => {
  const { active, chainId, account: web3Account, library } = useWeb3React();
  const { provider } = useWeb3Context();
  const account = impersonateAddress ? impersonateAddress : web3Account;
  const { transactionsCounter } = usePendingTransactions();

  const [data, setData] = useState<LiquidityGaugeV4PoolData>(
    defaultLiquidityGaugeV4PoolData
  );
  const [, setMulticallCounter] = useState(0);

  const doMulticall = useCallback(async () => {
    if (!chainId) {
      return;
    }

    if (!isProduction()) {
      console.time("Liquidity Gauge V4 Data Fetch");
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
      Object.keys(VaultLiquidityMiningMap.lg4).map(async (_vault) => {
        const vault = _vault as VaultOptions;

        const contract = getLiquidityGaugeV4(
          library || provider,
          vault,
          active
        )!;
        const vaultContract = getERC20Token(
          library || provider,
          getERC20TokenNameFromVault(vault, "v2"),
          chainId,
          active
        );

        /**
         * 1. Pool size
         */
        const unconnectedPromises: Promise<BigNumber>[] = [
          contract.totalSupply(),
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
                contract.balanceOf(account!),
                contract.claimable_reward(account!, RibbonTokenAddress),
                vaultContract!.balanceOf(account!),
                contract.claimed_reward(account!, RibbonTokenAddress),
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
          currentStake,
          claimableRbn,
          unstakedBalance,
          claimedRbn,
        };
      })
    );

    setMulticallCounter((counter) => {
      if (counter === currentCounter) {
        setData((prev) => ({
          responses: Object.fromEntries(
            responses.map(({ vault, ...response }) => [
              vault,
              {
                ...prev.responses[vault],
                ...response,
              },
            ])
          ) as LiquidityGaugeV4PoolResponses,
          loading: false,
        }));
      }

      return counter;
    });

    if (!isProduction()) {
      console.timeEnd("Liquidity Gauge V4 Data Fetch");
    }
  }, [account, active, chainId, library, provider]);

  useEffect(() => {
    doMulticall();
  }, [doMulticall, transactionsCounter]);

  return data;
};

export default useFetchLiquidityGaugeV4Data;
