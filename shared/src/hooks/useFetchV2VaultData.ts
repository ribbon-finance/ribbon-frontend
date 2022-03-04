import { useCallback, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "ethers";
import {
  EVMVaultList,
  getVaultNetwork,
  TreasuryVaultList,
} from "../constants/constants";
import { isProduction, isTreasury } from "../utils/env";
import { getV2VaultContract } from "./useV2VaultContract";
import { impersonateAddress } from "../utils/development";
import {
  defaultV2VaultData,
  V2VaultData,
  V2VaultDataResponses,
} from "../models/vault";
import { usePendingTransactions } from "./pendingTransactionsContext";
import { useEVMWeb3Context } from "./useEVMWeb3Context";
import { isVaultSupportedOnChain } from "../utils/vault";

const useFetchV2VaultData = (): V2VaultData => {
  const {
    chainId,
    active: web3Active,
    account: web3Account,
    library,
  } = useWeb3React();
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

    const vaultList = isTreasury() ? TreasuryVaultList : EVMVaultList;

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

        const contract = getV2VaultContract(
          library || inferredProviderFromVault,
          vault,
          active
        );
        if (!contract) {
          return { vault };
        }

        /**
         * 1. Total Balance
         * 2. Cap
         */
        const unconnectedPromises: Promise<
          | BigNumber
          | { amount: BigNumber; round: number }
          | { round: number }
          | { share: BigNumber; round: number }
        >[] = [
          contract.totalBalance(),
          contract.cap(),
          contract.pricePerShare(),
          contract.vaultState(),
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
                contract.accountVaultBalance(account!),
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
          pricePerShare,
          _vaultState,
          _depositReceipts,
          accountVaultBalance,
          _withdrawals,
        ] = await Promise.all(
          // Default to 0 when error
          promises.map((p) =>
            p.catch((e) => {
              return BigNumber.from(0);
            })
          )
        );

        const vaultState = (
          (_vaultState as { round?: number }).round ? _vaultState : { round: 1 }
        ) as { round: number };
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
          pricePerShare,
          round: vaultState.round,
          lockedBalanceInAsset: accountVaultBalance,
          depositBalanceInAsset:
            depositReceipts.round === vaultState.round
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
  }, [account, chainId, library, web3Active, getProviderForNetwork]);

  useEffect(() => {
    doMulticall();
  }, [doMulticall, transactionsCounter]);

  return data;
};

export default useFetchV2VaultData;
