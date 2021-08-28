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
    pollingFrequency: number;
  }
) => { data: V2VaultDataResponse; loading: boolean };

const useV2VaultData: UseVaultData = (
  vault,
  { poll, pollingFrequency } = { poll: true, pollingFrequency: 5000 }
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
      const unconnectedPromises: Promise<BigNumber | { amount: BigNumber }>[] =
        [contract.totalBalance(), contract.cap()];

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
            ]
          : [
              // Default value when not connected
              Promise.resolve({ amount: BigNumber.from(0) }),
              Promise.resolve(BigNumber.from(0)),
              Promise.resolve(BigNumber.from(0)),
            ]
      );

      const [
        totalBalance,
        cap,
        depositReceipts,
        accountVaultBalance,
        userAssetBalance,
      ] = await Promise.all(
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
          userAssetBalance,
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
