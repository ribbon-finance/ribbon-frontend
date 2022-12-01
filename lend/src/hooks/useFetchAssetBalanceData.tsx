import { useCallback, useEffect, useState } from "react";
import { BigNumber } from "ethers";

import { Assets, AssetsList } from "../store/types";
import { impersonateAddress } from "shared/lib/utils/development";
import { Chains, isNativeToken } from "../constants/constants";
import { ERC20Token } from "shared/lib/models/eth";
import { getERC20Token } from "shared/lib/hooks/useERC20Token";
import { isProduction } from "shared/lib/utils/env";
import { usePendingTransactions } from "shared/lib/hooks/pendingTransactionsContext";
import useWeb3Wallet from "shared/lib/hooks/useWeb3Wallet";
import { isEVMChain } from "../utils/chains";
import { useChain } from "./chainContext";
import { getChainByAsset } from "../utils/asset";

interface AssetBalance {
  asset: Assets;
  balance: BigNumber | undefined;
}

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
  const {
    ethereumProvider,
    chainId,
    active,
    account: web3Account,
  } = useWeb3Wallet();
  const account = impersonateAddress ? impersonateAddress : web3Account;
  const { transactionsCounter } = usePendingTransactions();
  const [chain] = useChain();

  const doMulticall = useCallback(async () => {
    if (!isProduction()) {
      console.time("Asset Balance Data Fetch"); // eslint-disable-line
    }

    if (!active) {
      setData({ ...defaultUserAssetBalanceData, loading: false });
      return;
    }

    const responses: Array<AssetBalance> = await Promise.all(
      AssetsList.map(async (asset) => {
        const defaultResponse = {
          asset,
          balance: undefined,
        };

        switch (getChainByAsset(asset)) {
          /**
           * EVM Chain
           */
          case Chains.Ethereum:
            /**
             * Return default response if it is not eth chain
             */
            if (isEVMChain(chain) && ethereumProvider) {
              const token = getERC20Token(
                ethereumProvider,
                asset.toLowerCase() as ERC20Token,
                chainId as number
              );
              if (token) {
                const balance = await (isNativeToken(asset)
                  ? ethereumProvider.getBalance(account!)
                  : token.balanceOf(account!));
                return { asset, balance };
              }
            }

            return defaultResponse;
        }

        return defaultResponse;
      })
    );

    setData((prevData) => ({
      data: Object.fromEntries(
        responses.map(({ asset, balance }) => [
          asset,
          /**
           * We fall back to previous value if balance is undefined
           */
          balance || prevData.data[asset],
        ])
      ) as UserAssetBalanceResponses,
      loading: false,
    }));

    if (!isProduction()) {
      console.timeEnd("Asset Balance Data Fetch"); // eslint-disable-line
    }
  }, [account, active, chain, chainId, ethereumProvider]);

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
