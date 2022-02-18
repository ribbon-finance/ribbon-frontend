import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { vaultUtils, vaultData } from "@zetamarkets/flex-sdk";
import { defaultSolanaVaultData, SolanaVaultData } from "../models/vault";
import { BigNumber } from "@ethersproject/bignumber";
import { parseUnits } from "ethers/lib/utils";
import { getAssetDecimals } from "../utils/asset";
import { useFlexVault } from "./useFlexVault";
import { PublicKey } from "@solana/web3.js";
import {
  getUserDepositQueueAmount,
  getUserWithdrawQueueAmount,
} from "../utils/vault";

const useFetchSolVaultData = (): SolanaVaultData => {
  const { connection } = useConnection();
  const { vault, client } = useFlexVault();
  const { publicKey } = useWallet();
  const [data, setData] = useState<SolanaVaultData>();

  useEffect(() => {
    const doMulticall = async () => {
      if (!vault || !connection) return;

      const [vaultAddress] = await vaultUtils.getVaultAddress("rSOL-THETA");
      const {
        depositLimit,
        epochSequenceNumber,
        totalBalance,
        pricePerShare,
        vaultUserData,
      } = await vaultData.getVaultData(connection, vaultAddress);

      const totalVaultQueuedDeposits = BigNumber.from(
        vault.depositQueue.reduce(
          (partialSum, a) => partialSum.add(a.info.amount.toString()),
          BigNumber.from(0)
        )
      );

      let lockedBalanceInAsset = BigNumber.from(0);
      let depositBalanceInAsset = BigNumber.from(0);
      let totalQueueWithdrawal = BigNumber.from(0);

      if (publicKey) {
        const totalQueueDeposit = await getUserDepositQueueAmount(
          vault,
          connection,
          publicKey as PublicKey
        );
        totalQueueWithdrawal = await getUserWithdrawQueueAmount(
          vault,
          connection,
          publicKey as PublicKey
        );

        const userData = vaultUserData.find(
          (d) =>
            publicKey &&
            vaultAddress &&
            d?.user.equals(publicKey as PublicKey) &&
            d?.vault.equals(vaultAddress)
        );

        lockedBalanceInAsset = BigNumber.from(
          Math.floor(userData?.lockedUnderlyingAmount ?? 0)
        );
        depositBalanceInAsset = totalQueueDeposit;
      }

      setData({
        responses: {
          "rSOL-THETA": {
            totalBalance: BigNumber.from(totalBalance).add(
              totalVaultQueuedDeposits
            ),
            cap: BigNumber.from(depositLimit),
            pricePerShare: pricePerShare
              ? parseUnits(
                  pricePerShare.toFixed(getAssetDecimals("SOL")),
                  getAssetDecimals("SOL")
                )
              : BigNumber.from(0),
            round: epochSequenceNumber,

            // user-connected state
            lockedBalanceInAsset,
            depositBalanceInAsset,
            withdrawals: {
              round: totalQueueWithdrawal.isZero() ? 0 : epochSequenceNumber,
              shares: totalQueueWithdrawal,
            },
          },
        },
        loading: false,
      } as SolanaVaultData);
    };

    doMulticall();
  }, [publicKey, vault, client, connection]);

  return data || defaultSolanaVaultData;
};

export default useFetchSolVaultData;
