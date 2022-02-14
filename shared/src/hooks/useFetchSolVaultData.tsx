import { useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { vaultUtils, vaultData } from "@zetamarkets/flex-sdk";
import { defaultSolanaVaultData, SolanaVaultData } from "../models/vault";
import { BigNumber } from "@ethersproject/bignumber";
import { parseUnits } from "ethers/lib/utils";
import { getAssetDecimals } from "../utils/asset";
import { useFlexVault } from "./useFlexVault";
import * as anchor from "@project-serum/anchor";

const useFetchSolVaultData = (): SolanaVaultData => {
  const { connection } = useConnection();
  const { vault, client } = useFlexVault();
  const [data, setData] = useState<SolanaVaultData>();

  useEffect(() => {
    const doMulticall = async () => {
      if (!vault) return;

      const [vaultAddress] = await vaultUtils.getVaultAddress("rSOL-THETA");
      const { depositLimit, epochSequenceNumber, totalBalance, pricePerShare } =
        await vaultData.getVaultData(connection, vaultAddress);

      let totalDeposit: number = 0;
      let totalWithdraw: number = 0;

      vault.depositQueue.forEach((deposit) => {
        const depositAmt = new anchor.BN(deposit.info.amount);
        totalDeposit += depositAmt.toNumber();
      });

      vault.withdrawalQueue.forEach((withdraw) => {
        const withdrawAmt = new anchor.BN(withdraw.info.amount);
        totalWithdraw += withdrawAmt.toNumber();
      });

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
            // balance in vault
            lockedBalanceInAsset: BigNumber.from(totalDeposit).sub(
              BigNumber.from(0)
            ),
            // balance in vault + deposit amount in the queue
            // lockedBalanceInAsset + sum(deposit amount in queue)
            depositBalanceInAsset: BigNumber.from(totalDeposit).sub(
              BigNumber.from(totalWithdraw)
            ),
            withdrawals: {
              round: epochSequenceNumber,
              shares: BigNumber.from(0),
            },
          },
        },
        loading: false,
      } as SolanaVaultData);
    };

    doMulticall();
  }, [vault, client, connection]);

  return data || defaultSolanaVaultData;
};

export default useFetchSolVaultData;
