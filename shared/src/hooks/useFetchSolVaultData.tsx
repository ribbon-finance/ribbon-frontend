import { useCallback, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { vaultUtils, vaultData, Vault } from "@zetamarkets/flex-sdk";
import { defaultSolanaVaultData, SolanaVaultData } from "../models/vault";
import { BigNumber } from "@ethersproject/bignumber";
import { parseUnits } from "ethers/lib/utils";
import { getAssetDecimals } from "../utils/asset";
import { useFlexVault } from "./useFlexVault";
import { PublicKey } from "@solana/web3.js";
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import * as anchor from "@project-serum/anchor";

const useFetchSolVaultData = (): SolanaVaultData => {
  const { connection } = useConnection();
  const { wallet, publicKey } = useWallet();
  const { loadedVault } = useFlexVault();
  const [data, setData] = useState<SolanaVaultData>(defaultSolanaVaultData);
  
  useEffect(() => {
    const getBalance = async () => {
      if(loadedVault) {
        const [vaultAddress] = await vaultUtils.getVaultAddress("TEST_VAULT");
        
        if(vaultAddress) {
          const { depositLimit, epochSequenceNumber, totalBalance, pricePerShare } =
          await vaultData.getVaultData(connection, vaultAddress);
  
          console.log(epochSequenceNumber)
        }
      }
    }

    if(publicKey) {
      getBalance();
    }
  }, [connection, publicKey])

  const doMulticall = useCallback(async () => {
    if (!loadedVault) return;

    const [vaultAddress] = await vaultUtils.getVaultAddress("TEST_VAULT");
    const vault = await Vault.getVault(new PublicKey(vaultAddress));
    const { depositLimit, epochSequenceNumber, totalBalance, pricePerShare } =
      await vaultData.getVaultData(connection, vaultAddress);

      console.log(vault.depositQueue)
      
      let totalDeposit: anchor.BN = new anchor.BN(0);
      vault.depositQueue.forEach(deposit => {
        const depositAmt = new anchor.BN(deposit.info.amount)
        console.log(depositAmt.toNumber())
        totalDeposit.add(depositAmt);
      })
      
      console.log(totalDeposit.toNumber())
      // const depositAmountAddress = vault.vaultWithdrawQueueRedeemableTokenAccount;
      // const tokenBalance = await connection.getTokenAccountBalance(depositAmountAddress);
      // console.log(tokenBalance)
      await vaultUtils.getVaultAddress("TEST_VAULT");
    setData({
      responses: {
        "rSOL-THETA": {
          totalBalance: BigNumber.from(totalBalance),
          cap: BigNumber.from(depositLimit),
          pricePerShare: pricePerShare
            ? parseUnits(
                pricePerShare.toFixed(getAssetDecimals("SOL")),
                getAssetDecimals("SOL")
              )
            : BigNumber.from(0),
          round: epochSequenceNumber,

          // user connected state
          lockedBalanceInAsset: BigNumber.from(0),
          depositBalanceInAsset: BigNumber.from(0),
          withdrawals: {
            round: epochSequenceNumber,
            shares: BigNumber.from(0),
          },
        },
      },
      loading: false,
    });

  }, [connection, setData, loadedVault]);

  useEffect(() => {
    doMulticall();
  }, [doMulticall]);

  return data;
};

export default useFetchSolVaultData;
