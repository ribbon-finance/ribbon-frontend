import { useCallback, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "ethers";

import { getAssets, VaultList } from "../constants/constants";
import { getV2Vault } from "./useV2Vault";
import { impersonateAddress } from "../utils/development";
import { isETHVault } from "../utils/vault";
import { getERC20Token } from "./useERC20Token";
import { ERC20Token } from "../models/eth";
import moment from "moment";
import {
  defaultV2VaultData,
  V2VaultData,
  V2VaultDataResponses,
} from "../models/vault";
import { useWeb3Context } from "./web3Context";
import { isProduction } from "../utils/env";

const useFetchV2VaultData = (
  {
    poll,
    pollingFrequency,
  }: {
    poll: boolean;
    pollingFrequency: number;
  } = { poll: true, pollingFrequency: 8000 }
): V2VaultData => {
  const { active, account: web3Account, library } = useWeb3React();
  const { provider } = useWeb3Context();
  const account = impersonateAddress ? impersonateAddress : web3Account;

  const [data, setData] = useState<V2VaultData>(defaultV2VaultData);

  const doMulticall = useCallback(async () => {
    if (!isProduction()) {
      console.time("V2 Vault Data Fetch");
    }

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
         * 2. Account vault balance
         * 3. User asset balance
         */
        const promises = unconnectedPromises.concat(
          active
            ? [
                contract.depositReceipts(account!),
                contract.accountVaultBalance(account!),
                isETHVault(vault)
                  ? library.getBalance(account!)
                  : getERC20Token(
                      library,
                      getAssets(vault).toLowerCase() as ERC20Token
                    )!.balanceOf(account!),
                contract.withdrawals(account!),
              ]
            : [
                // Default value when not connected
                Promise.resolve({ amount: BigNumber.from(0), round: 1 }),
                Promise.resolve(BigNumber.from(0)),
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
          userAssetBalance,
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
          userAssetBalance,
          withdrawals,
          lastFetched: moment(),
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
            withdrawals: response.withdrawals
              ? {
                  ...response.withdrawals,
                  amount: response.withdrawals.shares
                    .mul(response.pricePerShare as BigNumber)
                    .div(
                      BigNumber.from(10).pow(prev.responses[vault].decimals)
                    ),
                }
              : prev.responses[vault].withdrawals,
          },
        ])
      ) as V2VaultDataResponses,
      loading: false,
    }));

    if (!isProduction()) {
      console.timeEnd("V2 Vault Data Fetch");
    }
  }, [account, active, library, provider]);

  useEffect(() => {
    let pollInterval: any = undefined;
    if (poll) {
      doMulticall();
      pollInterval = setInterval(doMulticall, pollingFrequency);
    } else {
      doMulticall();
    }

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [doMulticall, poll, pollingFrequency]);

  return data;
};

export default useFetchV2VaultData;
