import { useCallback, useEffect, useState } from "react";
import { BigNumber } from "ethers";

import { Assets, AssetsList } from "../store/types";
import { impersonateAddress } from "../utils/development";
import { Chains, isNativeToken } from "../constants/constants";
import { ERC20Token } from "../models/eth";
import { getERC20Token } from "./useERC20Token";
import { isProduction } from "../utils/env";
import { usePendingTransactions } from "./pendingTransactionsContext";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import useWeb3Wallet from "./useWeb3Wallet";
import { isEVMChain, isSolanaChain } from "../utils/chains";
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
  const { connection } = useConnection();
  const { publicKey } = useWallet();
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
          case Chains.Avalanche:
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

          /**
           * Solana Chain
           */
          case Chains.Solana:
            if (isSolanaChain(chain)) {
              if (isNativeToken(asset)) {
                // FIXME: Token balance should query based on address of Solana-based tokens
                // const tokenBalance = await connection.getTokenAccountBalance(new PublicKey("So11111111111111111111111111111111111111112"));
                const tokenBalance = await connection.getBalance(
                  publicKey as PublicKey
                );
                return {
                  asset,
                  balance: BigNumber.from(tokenBalance),
                };
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
  }, [
    account,
    active,
    chain,
    chainId,
    ethereumProvider,
    connection,
    publicKey,
  ]);

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
