import { useCallback, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "ethers";

import { getAssets, VaultList } from "../constants/constants";
import { getV2Vault } from "./useV2Vault";
import { impersonateAddress } from "../utils/development";
import {
  defaultV2VaultData,
  V2VaultData,
  V2VaultDataResponses,
} from "../models/vault";
import { useWeb3Context } from "./web3Context";
import { isProduction } from "../utils/env";
import { getAssetDecimals } from "../utils/asset";
import { usePendingTransactions } from "./pendingTransactionsContext";

const useFetchV2VaultData = (): V2VaultData => {
  const { active, account: web3Account, library } = useWeb3React();
  const { provider } = useWeb3Context();
  const account = impersonateAddress ? impersonateAddress : web3Account;
  const { transactionsCounter } = usePendingTransactions();

  const [data, setData] = useState<V2VaultData>(defaultV2VaultData);
  const [, setMulticallCounter] = useState(0);

  const doMulticall = useCallback(async () => {
    if (!isProduction()) {
      console.time("V2 Vault Data Fetch");
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
        const contract = getV2Vault(library || provider, vault, active);
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
          promises.map((p) => p.catch((e) => BigNumber.from(0)))
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
                withdrawals: withdrawals
                  ? {
                      ...withdrawals,
                      amount: withdrawals.shares
                        .mul(response.pricePerShare as BigNumber)
                        .div(
                          BigNumber.from(10).pow(
                            getAssetDecimals(getAssets(vault))
                          )
                        ),
                    }
                  : prev.responses[vault].withdrawals,
              },
            ])
          ) as V2VaultDataResponses,
          loading: false,
        }));
      }

      return counter;
    });

    if (!isProduction()) {
      console.timeEnd("V2 Vault Data Fetch");
    }
  }, [account, active, library, provider]);

  useEffect(() => {
    doMulticall();
  }, [doMulticall, transactionsCounter]);

  return data;
};

export default useFetchV2VaultData;
