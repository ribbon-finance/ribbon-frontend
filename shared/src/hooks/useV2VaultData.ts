import { useCallback, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "ethers";

import { V2VaultDataResponse } from "../store/types";
import { useGlobalState } from "../store/store";
import { VaultOptions } from "../constants/constants";
import useV2Vault from "./useV2Vault";
import { impersonateAddress } from "../utils/development";

type UseVaultData = (
  vault: VaultOptions,
  params?: {
    poll: boolean;
    pollingFrequency: number;
  }
) => { data: V2VaultDataResponse; loading: boolean };

const useV2VaultData: UseVaultData = (
  vault,
  { poll, pollingFrequency } = { poll: true, pollingFrequency: 5000 }
) => {
  const { active, account: web3Account } = useWeb3React();
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
      const unconnectedPromises: Promise<BigNumber | { amount: BigNumber }>[] =
        [contract.totalBalance(), contract.cap()];

      /**
       * 1. Deposit receipts
       * 2. Account vault balance
       */
      const promises = unconnectedPromises.concat(
        active
          ? [
              contract.depositReceipts(account!),
              contract.accountVaultBalance(account!),
            ]
          : [
              // Default value when not connected
              (async () => ({ amount: BigNumber.from(0) }))(),
              (async () => BigNumber.from(0))(),
            ]
      );

      const [totalBalance, cap, depositReceipts, accountVaultBalance] =
        await Promise.all(
          // Default to 0 when error
          promises.map((p) => p.catch((e) => BigNumber.from(0)))
        );

      setResponse((prevResponse) => ({
        ...prevResponse,
        [vault]: {
          ...prevResponse[vault],
          totalBalance,
          cap,
          lockedBalanceInAsset: accountVaultBalance,
          depositBalanceInAsset: (depositReceipts as { amount: BigNumber })
            .amount,
        },
      }));

      if (!isInterval) {
        setLoading(false);
      }
    },
    [account, active, contract, setResponse, vault]
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
