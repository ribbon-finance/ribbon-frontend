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
      if (!vault || !client || !connection) return;

      const [vaultAddress] = await vaultUtils.getVaultAddress("rSOL-THETA");
      const {
        depositLimit,
        epochSequenceNumber,
        totalBalance,
        pricePerShare,
        vaultUserData,
      } = await vaultData.getVaultData(connection, vaultAddress);

      const depositQueueAmounts = await Promise.all(
        vault.depositQueue.map((node) => connection.getBalance(node.address))
      );
      const totalVaultQueuedDeposits = BigNumber.from(
        depositQueueAmounts.reduce((partialSum, a) => partialSum + a, 0)
      );

      const totalQueueDeposit = await getUserDepositQueueAmount(
        vault,
        connection,
        publicKey as PublicKey
      );
      const totalQueueWithdrawal = await getUserWithdrawQueueAmount(
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

      const lockedBalanceInAsset = BigNumber.from(
        Math.floor(userData?.lockedUnderlyingAmount ?? 0)
      );
      const depositBalanceInAsset = totalQueueDeposit;

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
            lockedBalanceInAsset,
            depositBalanceInAsset,
            withdrawals: {
              round: epochSequenceNumber,
              shares: BigNumber.from(totalQueueWithdrawal),
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
