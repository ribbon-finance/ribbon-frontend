import { useCallback, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "ethers";
import {
  EVMVaultList,
  getVaultNetwork,
  isEarnVault,
  isPutVault,
  TreasuryVaultList,
  VIPVaultList,
} from "../constants/constants";
import { isProduction, isTreasury, isVIP } from "../utils/env";
import { getVaultContract } from "./useVaultContract";
import { getStrikeSelectionContract } from "./useStrikeSelection";
import { impersonateAddress } from "../utils/development";
import {
  defaultV2VaultData,
  V2VaultData,
  V2VaultDataResponses,
} from "../models/vault";
import { usePendingTransactions } from "./pendingTransactionsContext";
import { useEVMWeb3Context } from "./useEVMWeb3Context";
import { isVaultSupportedOnChain } from "../utils/vault";
import { calculatePricePerShare, getNextFridayTimestamp } from "../utils/math";
import { RibbonV2ThetaVault } from "../codegen";

const useFetchV2VaultData = (): V2VaultData => {
  const {
    chainId,
    active: web3Active,
    account: web3Account,
    library,
  } = useWeb3React();
  const account = impersonateAddress ? impersonateAddress : web3Account;
  const expiryTimestamp = getNextFridayTimestamp();
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

    const vaultList = isTreasury()
      ? TreasuryVaultList
      : isVIP()
      ? VIPVaultList
      : EVMVaultList;

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
          library || inferredProviderFromVault,
          vault,
          active
        ) as RibbonV2ThetaVault;

        if (!contract) {
          return { vault };
        }

        const strikeSelectionAddress = !isEarnVault(vault)
          ? await contract.strikeSelection().catch((e) => {
              return undefined;
            })
          : undefined;

        const strikeSelectionContract = strikeSelectionAddress
          ? getStrikeSelectionContract(
              library || inferredProviderFromVault,
              strikeSelectionAddress,
              active
            )
          : undefined;

        /**
         * 1. Total Balance
         * 2. Cap
         * 3. Price Per Share
         * 4. Get Strike Price
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
          | { newStrikePrice: BigNumber; newDelta: BigNumber }
        >[] = [
          contract.totalBalance(),
          contract.cap(),
          contract.vaultState(),
          contract.lastQueuedWithdrawAmount(),
          contract.totalSupply(),
          contract.decimals(),
          strikeSelectionContract
            ? strikeSelectionContract.getStrikePrice(
                expiryTimestamp,
                isPutVault(vault)
              )
            : Promise.resolve({
                newStrikePrice: BigNumber.from(0),
                newDelta: BigNumber.from(0),
              }),
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
          _getStrikePrice,
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

        const accountVaultBalance = (shares as BigNumber)
          .mul(actualPricePerShare)
          .div(BigNumber.from("10").pow(decimals as BigNumber));

        const getStrikePrice = (
          (_getStrikePrice as { newStrikePrice: BigNumber }).newStrikePrice
            ? _getStrikePrice
            : { newStrikePrice: BigNumber.from(0) }
        ) as { newStrikePrice: BigNumber };

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
          (_withdrawals as { shares: BigNumber; round: number }).round
            ? _withdrawals
            : { shares: BigNumber.from(0), round: 1 }
        ) as { shares: BigNumber; round: number };

        return {
          vault,
          totalBalance,
          cap,
          pricePerShare: actualPricePerShare,
          round,
          strikePrice: getStrikePrice.newStrikePrice,
          lockedBalanceInAsset: accountVaultBalance,
          depositBalanceInAsset:
            depositReceipts.round === round
              ? depositReceipts.amount
              : BigNumber.from(0),
          withdrawals,
        };
      })
    );

    setMulticallCounter((counter) => {
      if (counter === currentCounter) {
        setData((prev) => ({
          responses: Object.fromEntries(
            responses.map(({ vault, withdrawals, ...response }) => [
              vault,
              {
                ...prev.responses[vault],
                ...response,
                withdrawals: withdrawals || prev.responses[vault].withdrawals,
              },
            ])
          ) as V2VaultDataResponses,
          loading: false,
        }));
      }

      return counter;
    });

    if (!isProduction()) {
      console.timeEnd("V2 Vault Data Fetch"); // eslint-disable-line
    }
  }, [
    getProviderForNetwork,
    web3Active,
    chainId,
    library,
    expiryTimestamp,
    account,
  ]);

  useEffect(() => {
    doMulticall();
  }, [doMulticall, transactionsCounter]);

  return data;
};

export default useFetchV2VaultData;
