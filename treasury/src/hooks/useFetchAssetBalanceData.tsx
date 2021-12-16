import { useCallback, useEffect, useState } from "react";
import { BigNumber } from "ethers";

import { Assets, AssetsList } from "../store/types";
import { useWeb3React } from "@web3-react/core";
import { impersonateAddress } from "shared/lib/utils/development";
import { isNativeToken } from "../constants/constants";
import { ERC20Token } from "shared/lib/models/eth";
import { getERC20Token } from "shared/lib/hooks/useERC20Token";
import { isProduction } from "shared/lib/utils/env";
import { usePendingTransactions } from "./pendingTransactionsContext";

export type UserAssetBalanceResponses = { [asset in Assets]: BigNumber };
export type UserAssetBalanceData = {
  data: UserAssetBalanceResponses;
  loading: boolean;
};
export const defaultUserAssetBalanceData: UserAssetBalanceData = {
  data: Object.fromEntries(
    AssetsList.map((asset) => [asset, BigNumber.from(0)])
  ) as UserAssetBalanceResponses,
  loading: true,
};

const useFetchAssetBalanceData = (
  {
    poll,
    pollingFrequency,
  }: {
    poll: boolean;
    pollingFrequency: number;
  } = { poll: true, pollingFrequency: 20000 }
) => {
  const [data, setData] = useState<UserAssetBalanceData>(
    defaultUserAssetBalanceData
  );
  const { library, chainId, active, account: web3Account } = useWeb3React();
  const account = impersonateAddress ? impersonateAddress : web3Account;
  const { transactionsCounter } = usePendingTransactions();

  const doMulticall = useCallback(async () => {
    if (!isProduction()) {
      console.time("Asset Balance Data Fetch");
    }

    if (!active || !chainId) {
      setData({ ...defaultUserAssetBalanceData, loading: false });
      return;
    }

    const responses = await Promise.all(
      AssetsList.map(async (asset) => {
        const token = getERC20Token(library, asset.toLowerCase() as ERC20Token, chainId);
        if (!token) {
          return { asset, balance: undefined };
        }

        const balance = await(isNativeToken(asset) ? library.getBalance(account!) : token.balanceOf(account!));

        return { asset, balance };
      })
    );

    setData({
      data: Object.fromEntries(
        responses.map((response) => [response.asset, response.balance])
      ) as UserAssetBalanceResponses,
      loading: false,
    });

    if (!isProduction()) {
      console.timeEnd("Asset Balance Data Fetch");
    }
  }, [account, active, chainId, library]);

  /**
   * Fetch on first load and transaction success
   */
  useEffect(() => {
    doMulticall();
  }, [doMulticall, transactionsCounter]);

  /**
   * Schedule polling
   * We still need polling as user might perform transaction that changes their asset balance
   * (buy/sell) outside of app
   */
  useEffect(() => {
    let pollInterval: any = undefined;

    if (poll) {
      pollInterval = setInterval(doMulticall, pollingFrequency);
    }

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [doMulticall, poll, pollingFrequency]);

  return data;
};

export default useFetchAssetBalanceData;
