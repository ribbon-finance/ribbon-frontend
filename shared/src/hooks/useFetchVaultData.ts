import { BigNumber } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";

import { useWeb3Context } from "./web3Context";
import { getVault } from "./useVault";
import { VaultList } from "../constants/constants";
import { impersonateAddress } from "../utils/development";
import {
  defaultVaultData,
  VaultData,
  VaultDataResponses,
} from "../models/vault";
import { isProduction } from "../utils/env";

const useFetchVaultData = (
  {
    poll,
    pollingFrequency,
  }: {
    poll: boolean;
    pollingFrequency: number;
  } = { poll: true, pollingFrequency: 8000 }
): VaultData => {
  const { library, active, account: web3Account } = useWeb3React();
  const { provider } = useWeb3Context();
  const account = impersonateAddress ? impersonateAddress : web3Account;

  const [data, setData] = useState<VaultData>(defaultVaultData);

  const doMulticall = useCallback(async () => {
    if (!isProduction()) {
      console.time("V1 Vault Data Fetch");
    }

    const responses = await Promise.all(
      VaultList.map(async (vault) => {
        const contract = getVault(library || provider, vault, active);

        /**
         * 1. Total Balance
         * 2. Cap
         * 3. max Withdrawalble Shares
         * 4. Total Supply
         */
        const unconnectedPromises: Promise<BigNumber>[] = [
          contract.totalBalance(),
          contract.cap(),
          contract.maxWithdrawableShares(),
          contract.totalSupply(),
        ];

        /**
         * 1. Vault balance in asset
         * 2. Max withdraw amount
         */
        const promises = unconnectedPromises.concat(
          active
            ? [
                contract.accountVaultBalance(account!),
                contract.maxWithdrawAmount(account!),
              ]
            : [
                // Default value when not connected
                Promise.resolve(BigNumber.from(0)),
                Promise.resolve(BigNumber.from(0)),
              ]
        );

        const [
          deposits,
          vaultLimit,
          vaultMaxWithdrawableShares,
          totalSupply,
          vaultBalanceInAsset,
          maxWithdrawAmount,
        ] = await Promise.all(
          promises.map((p) => p.catch((e) => BigNumber.from(0)))
        );

        return {
          vault,
          deposits,
          vaultLimit,
          vaultMaxWithdrawableShares,
          totalSupply,
          vaultBalanceInAsset,
          maxWithdrawAmount,
        };
      })
    );

    setData({
      responses: Object.fromEntries(
        responses.map(
          ({ vault, vaultMaxWithdrawableShares, totalSupply, ...response }) => [
            vault,
            {
              ...response,
              vaultMaxWithdrawAmount: !totalSupply.isZero()
                ? vaultMaxWithdrawableShares
                    .mul(response.deposits)
                    .div(totalSupply)
                : BigNumber.from(0),
            },
          ]
        )
      ) as VaultDataResponses,
      loading: false,
    });

    if (!isProduction()) {
      console.timeEnd("V1 Vault Data Fetch");
    }
  }, [account, active, library, provider]);

  useEffect(() => {
    // eslint-disable-next-line no-undef
    let pollInterval: NodeJS.Timeout | null = null;
    doMulticall();

    if (poll) {
      pollInterval = setInterval(doMulticall, pollingFrequency);
    }

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [poll, pollingFrequency, doMulticall]);

  return data;
};

export default useFetchVaultData;
