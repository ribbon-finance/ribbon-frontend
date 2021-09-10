import { useCallback, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "ethers";

import { V2VaultDataResponse } from "../store/types";
import { useGlobalState } from "../store/store";
import { getAssets, VaultOptions } from "../constants/constants";
import useV2Vault from "./useV2Vault";
import { impersonateAddress } from "../utils/development";
import { isETHVault } from "../utils/vault";
import { getERC20Token } from "./useERC20Token";
import { ERC20Token } from "../models/eth";

type UseVaultData = (
  vault: VaultOptions,
  params?: {
    poll: boolean;
    pollingFrequency?: number;
  }
) => { data: V2VaultDataResponse; loading: boolean };

const useV2VaultData: UseVaultData = (
  vault,
  { poll, pollingFrequency = 5000 } = { poll: false, pollingFrequency: 5000 }
) => {
  const { active, account: web3Account, library } = useWeb3React();
  const contract = useV2Vault(vault);
  const account = impersonateAddress ? impersonateAddress : web3Account;

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useGlobalState("v2VaultData");

  const doMulticall = useCallback(
    async (isInterval: boolean = true) => {
      if (!contract) {
        return;
      }

      if (!isInterval) {
        setLoading(true);
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
              Promise.resolve({ round: 1, share: BigNumber.from(0) }),
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

      setResponse((prevResponse) => ({
        ...prevResponse,
        [vault]: {
          ...prevResponse[vault],
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
          withdrawals: {
            ...withdrawals,
            amount: withdrawals.shares
              .mul(pricePerShare as BigNumber)
              .div(BigNumber.from(10).pow(prevResponse[vault].decimals)),
          },
        },
      }));

      if (!isInterval) {
        setLoading(false);
      }
    },
    [account, active, contract, library, setResponse, vault]
  );

  useEffect(() => {
    let pollInterval: any = undefined;
    if (poll) {
      doMulticall(false);
      pollInterval = setInterval(doMulticall, pollingFrequency);
    } else {
      doMulticall(false);
    }

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [poll, pollingFrequency, doMulticall]);

  return { data: response[vault], loading };
};

export default useV2VaultData;
