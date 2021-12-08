import { useCallback, useEffect, useState } from "react";
import { BigNumber } from "ethers";

import { Assets, AssetsList } from "../store/types";
import { useWeb3React } from "@web3-react/core";
import { impersonateAddress } from "../utils/development";
import { ERC20Token } from "../models/eth";
import { getERC20Token } from "./useERC20Token";
import { isProduction } from "../utils/env";
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
  const { library, active, account: web3Account } = useWeb3React();
  const account = impersonateAddress ? impersonateAddress : web3Account;
  const { transactionsCounter } = usePendingTransactions();

  const doMulticall = useCallback(async () => {
    if (!isProduction()) {
      console.time("Asset Balance Data Fetch");
    }

    if (!active) {
      setData({ ...defaultUserAssetBalanceData, loading: false });
      return;
    }

    const responses = await Promise.all(
      AssetsList.map(async (asset) => {
        const balance = await (asset === "WETH" || asset === 'WAVAX'
          ? library.getBalance(account!)
          : getERC20Token(
              library,
              asset.toLowerCase() as ERC20Token
            )!.balanceOf(account!));

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
  }, [account, active, library]);

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
