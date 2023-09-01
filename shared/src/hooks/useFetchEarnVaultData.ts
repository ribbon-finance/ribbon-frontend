import { useCallback, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "ethers";
import {
  getVaultNetwork,
  EarnVaultList,
  VIPVaultList,
  isEarnVault,
} from "../constants/constants";
import { isProduction, isTreasury, isVIP } from "../utils/env";
import { getVaultContract } from "./useVaultContract";
import { impersonateAddress } from "../utils/development";
import {
  defaultV2VaultData,
  V2VaultData,
  V2VaultDataResponses,
} from "../models/vault";
import { usePendingTransactions } from "./pendingTransactionsContext";
import { useEVMWeb3Context } from "./useEVMWeb3Context";
import { isVaultSupportedOnChain } from "../utils/vault";
import { RibbonEarnVault } from "../codegen";
import { calculatePricePerShare } from "../utils/math";
import useWeb3Wallet from "./useWeb3Wallet";

const useFetchEarnVaultData = (): V2VaultData => {
  const { chainId, account: web3Account, provider } = useWeb3React();
  const { active: web3Active } = useWeb3Wallet();
  const account = impersonateAddress ? impersonateAddress : web3Account;
  const { transactionsCounter } = usePendingTransactions();
  const { getProviderForNetwork } = useEVMWeb3Context();

  const [data, setData] = useState<V2VaultData>(defaultV2VaultData);
  const [, setMulticallCounter] = useState(0);

  const doMulticall = useCallback(async () => {
    if (!isProduction()) {
      console.time("V2 Vault Data Fetch"); // eslint-disable-line
    }

    /**
     * We keep track with counter so to make sure we always only update with the latest info
     */
    let currentCounter: number;
    setMulticallCounter((counter) => {
      currentCounter = counter + 1;
      return currentCounter;
    });

    const vaultList = isTreasury() || isVIP() ? VIPVaultList : EarnVaultList;

    const responses = await Promise.all(
      vaultList.map(async (vault) => {
        const inferredProviderFromVault = getProviderForNetwork(
          getVaultNetwork(vault)
        );
        const active = Boolean(
          web3Active &&
            isVaultSupportedOnChain(
              vault,
              chainId || inferredProviderFromVault?._network?.chainId
            )
        );

        const contract = getVaultContract(
          active ? provider : inferredProviderFromVault,
          vault,
          active
        ) as RibbonEarnVault;

        if (!contract) {
          return { vault };
        }

        /**
         * 1. Total Balance
         * 2. Cap
         */
        const unconnectedPromises: Promise<
          | BigNumber
          | number
          | { amount: BigNumber; round: number }
          | {
              totalPending: BigNumber;
              queuedWithdrawShares: BigNumber;
              round: number;
            }
          | { round: number }
          | { share: BigNumber; round: number }
          | { loanAllocationPCT: number; optionAllocationPCT: number }
        >[] = [
          contract.totalBalance(),
          contract.cap(),
          contract.vaultState(),
          contract.lastQueuedWithdrawAmount(),
          contract.totalSupply(),
          contract.decimals(),
          contract.allocationState(),
        ];
        /**
         * 1. Deposit receipts
         * 2. User asset balance
         * 3. Withdrawals
         */
        const promises = unconnectedPromises.concat(
          active
            ? [
                contract.depositReceipts(account!),
                contract.shares(account!),
                contract.withdrawals(account!),
              ]
            : [
                // Default value when not connected
                Promise.resolve({ amount: BigNumber.from(0), round: 1 }),
                Promise.resolve(BigNumber.from(0)),
                Promise.resolve({ round: 1, shares: BigNumber.from(0) }),
              ]
        );

        const [
          totalBalance,
          cap,
          _vaultState,
          lastQueuedWithdrawAmount,
          totalSupply,
          decimals,
          _allocationState,
          _depositReceipts,
          shares,
          _withdrawals,
        ] = await Promise.all(
          // Default to 0 when error
          promises.map((p) =>
            p.catch((e) => {
              return BigNumber.from(0);
            })
          )
        );

        const {
          totalPending = BigNumber.from(1),
          queuedWithdrawShares = BigNumber.from(1),
          round = 1,
        } = (_vaultState || {}) as {
          totalPending?: BigNumber;
          queuedWithdrawShares?: BigNumber;
          round?: number;
        };

        const actualPricePerShare = calculatePricePerShare(
          decimals as BigNumber,
          totalBalance as BigNumber,
          totalPending,
          lastQueuedWithdrawAmount as BigNumber,
          totalSupply as BigNumber,
          queuedWithdrawShares
        );

        const roundPricePerShare = round
          ? await contract.roundPricePerShare(round - 1)
          : BigNumber.from(0);

        const usedPricePerShare =
          vault === "rEARN" ? roundPricePerShare : actualPricePerShare;

        const accountVaultBalance = (shares as BigNumber)
          .mul(usedPricePerShare)
          .div(BigNumber.from("10").pow(decimals as BigNumber));
        // we use roundPricePerShare for earn treasury because pricePerShare goes down
        // during the round itself

        const allocationState = (
          (
            _allocationState as {
              loanAllocationPCT: number;
              optionAllocationPCT: number;
            }
          ).optionAllocationPCT
            ? _allocationState
            : { loanAllocationPCT: 0, optionAllocationPCT: 0 }
        ) as { loanAllocationPCT: number; optionAllocationPCT: number };

        const depositReceipts = (
          (
            _depositReceipts as {
              amount: BigNumber;
              round: number;
            }
          ).amount
            ? _depositReceipts
            : { amount: BigNumber.from(0), round: 1 }
        ) as {
          amount: BigNumber;
          round: number;
        };
        const withdrawals = (
          _withdrawals &&
          (_withdrawals as { shares: BigNumber; round: number }).round
            ? _withdrawals
            : { shares: BigNumber.from(0), round: 1 }
        ) as { shares: BigNumber; round: number };

        return {
          vault,
          totalBalance,
          cap,
          pricePerShare: actualPricePerShare,
          round: round,
          roundPricePerShare,
          lockedBalanceInAsset: accountVaultBalance,
          shares,
          depositBalanceInAsset:
            depositReceipts.round === round
              ? depositReceipts.amount
              : BigNumber.from(0),
          withdrawals,
          allocationState,
        };
      })
    );

    setMulticallCounter((counter) => {
      if (counter === currentCounter) {
        setData((prev) => ({
          responses: Object.fromEntries(
            responses.map(
              ({ vault, withdrawals, allocationState, ...response }) => [
                vault,
                {
                  ...prev.responses[vault],
                  ...response,
                  withdrawals: withdrawals || prev.responses[vault].withdrawals,
                  allocationState: allocationState,
                },
              ]
            )
          ) as V2VaultDataResponses,
          loading: false,
        }));
      }

      return counter;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getProviderForNetwork, web3Active, chainId, account]);

  useEffect(() => {
    doMulticall();
  }, [doMulticall, transactionsCounter]);

  return data;
};

export default useFetchEarnVaultData;
