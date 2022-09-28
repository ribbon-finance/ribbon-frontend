import { BigNumber } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";

import { useWeb3Context } from "./web3Context";
import { getLendContract } from "./useLendContract";
import { VaultList } from "../constants/constants";
import { impersonateAddress } from "shared/lib/utils/development";
import {
  defaultVaultData,
  VaultData,
  VaultDataResponses,
} from "../models/vault";
import { isProduction } from "../utils/env";
import { usePendingTransactions } from "./pendingTransactionsContext";
import { isVaultSupportedOnChain } from "../utils/vault";

const useFetchVaultData = (): VaultData => {
  const {
    chainId,
    library,
    active: web3Active,
    account: web3Account,
  } = useWeb3React();

  const { provider } = useWeb3Context();
  const account = impersonateAddress ? impersonateAddress : web3Account;
  const { transactionsCounter } = usePendingTransactions();

  const [data, setData] = useState<VaultData>(defaultVaultData);
  const [, setMulticallCounter] = useState(0);

  const doMulticall = useCallback(async () => {
    if (!isProduction()) {
      console.time("V1 Vault Data Fetch"); // eslint-disable-line
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
      VaultList.map(async (vault) => {
        // If we don't support the vault on the chainId, we just return the inactive data state
        const active = Boolean(
          web3Active && isVaultSupportedOnChain(vault, chainId || 1)
        );

        const contract = getLendContract(library || provider, vault, active);

        if (!contract) {
          return { vault };
        }

        /**
         * 1. Total Balance
         * 2. Utilization Rate
         * 3. max Withdrawable Shares
         * 4. Total Supply
         */
        const unconnectedPromises: Promise<BigNumber>[] = [
          contract.poolSize(),
          contract.availableToWithdraw(),
          contract.getUtilizationRate(),
          contract.availableToWithdraw(),
          contract.availableToBorrow(),
          contract.getCurrentExchangeRate(),
          contract.totalSupply(),
          contract.getSupplyRate(),
          contract.rewardPerSecond(),
        ];

        /**
         * 1. Vault balance in asset
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
          vaultMaxWithdrawableShares,
          availableToBorrow,
          currentExchangeRate,
          totalSupply,
          supplyRate,
          rewardPerSecond,
          vaultBalance,
          accumulativeReward,
          withdrawableReward,
          withdrawnReward,
        ] = await Promise.all(
          promises.map((p) => p.catch((e) => BigNumber.from(0)))
        );

        return {
          vault,
          poolSize,
          availableToWithdraw,
          utilizationRate,
          vaultMaxWithdrawableShares,
          availableToBorrow,
          currentExchangeRate,
          totalSupply,
          supplyRate,
          rewardPerSecond,
          vaultBalance,
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
                vault,
                availableToWithdraw,
                utilizationRate,
                vaultMaxWithdrawableShares,
                availableToBorrow,
                currentExchangeRate,
                totalSupply,
                supplyRate,
                rewardPerSecond,
                accumulativeReward,
                withdrawableReward,
                withdrawnReward,
                ...response
              }) => [
                vault,
                {
                  ...prev.responses[vault],
                  ...response,
                  availableToWithdraw: availableToWithdraw,
                  utilizationRate: utilizationRate,
                  supplyRate: supplyRate,
                  rewardPerSecond: rewardPerSecond,
                  availableToBorrow: availableToBorrow,
                  currentExchangeRate: currentExchangeRate,
                  accumulativeReward: accumulativeReward,
                  withdrawableReward: withdrawableReward,
                  withdrawnReward: withdrawnReward,
                  vaultBalanceInAsset:
                    response.vaultBalance && currentExchangeRate
                      ? currentExchangeRate
                          .mul(response.vaultBalance)
                          .div(BigNumber.from(10).pow(18))
                      : BigNumber.from(0),
                  vaultMaxWithdrawAmount:
                    totalSupply &&
                    vaultMaxWithdrawableShares &&
                    response.poolSize &&
                    !totalSupply.isZero()
                      ? vaultMaxWithdrawableShares
                          .mul(response.poolSize)
                          .div(totalSupply)
                      : BigNumber.from(0),
                },
              ]
            )
          ) as VaultDataResponses,
          loading: false,
        }));
      }

      return counter;
    });

    if (!isProduction()) {
      console.timeEnd("Vault Data Fetch"); // eslint-disable-line
    }
  }, [account, web3Active, library, provider, chainId]);

  useEffect(() => {
    doMulticall();
  }, [doMulticall, transactionsCounter]);

  return data;
};

export default useFetchVaultData;
