import { useCallback, useEffect, useState } from "react";
import { BigNumber } from "ethers";

import { Assets, AssetsList } from "../store/types";
import { useWeb3React } from "@web3-react/core";
import { impersonateAddress } from "../utils/development";
import { isNativeToken } from "../constants/constants";
import { ERC20Token } from "../models/eth";
import { getERC20Token } from "./useERC20Token";
import { isProduction } from "../utils/env";
import { usePendingTransactions } from "./pendingTransactionsContext";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import useWeb3Wallet from "./useWeb3Wallet";
import { isEthereumWallet, isSolanaWallet, Wallet } from "../models/wallets";

interface AssetBalance {
  asset: Assets;
  balance: BigNumber | undefined
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
  const { ethereumProvider, chainId , active, account: web3Account, connectedWallet } = useWeb3Wallet();
  const account = impersonateAddress ? impersonateAddress : web3Account;
  const { transactionsCounter } = usePendingTransactions();
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const doMulticall = useCallback(async () => {
    if (!isProduction()) {
      console.time("Asset Balance Data Fetch");
    }

    if (!active) {
      setData({ ...defaultUserAssetBalanceData, loading: false });
      return;
    }

    let ERC20Responses: Array<AssetBalance> = [];
    let SOLResponse: Array<AssetBalance> = [];

    if(isEthereumWallet(connectedWallet as Wallet)) {
      ERC20Responses = await Promise.all(
       AssetsList.map(async (asset) => {
         const token = getERC20Token(
           ethereumProvider,
           asset.toLowerCase() as ERC20Token,
           chainId as number
         );
         if (!token) {
           return { asset, balance: undefined } as AssetBalance;
         }
 
         const balance = await (isNativeToken(asset)
           ? ethereumProvider?.getBalance(account!)
           : token.balanceOf(account!));
 
         return { asset, balance };
       })
     );
    }

    if(isSolanaWallet(connectedWallet as Wallet)) {
      // FIXME: Token balance should query based on address of Solana-based tokens
      // const tokenBalance = await connection.getTokenAccountBalance(new PublicKey("So11111111111111111111111111111111111111112"));
      const tokenBalance = await connection.getBalance(publicKey as PublicKey);
      SOLResponse.push({
        asset: "SOL",
        balance: BigNumber.from(tokenBalance)
      });
    }

    setData({
      data: Object.fromEntries(
        [...ERC20Responses.map((response) => [response.asset, response.balance]), ...SOLResponse.map((response) => [response.asset, response.balance])]
      ) as UserAssetBalanceResponses,
      loading: false,
    });

    if (!isProduction()) {
      console.timeEnd("Asset Balance Data Fetch");
    }
  }, [account, active, chainId, ethereumProvider]);

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
