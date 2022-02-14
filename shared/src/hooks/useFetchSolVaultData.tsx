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
      if (!vault) return;

      const [vaultAddress] = await vaultUtils.getVaultAddress("rSOL-THETA");
      const { depositLimit, epochSequenceNumber, totalBalance, pricePerShare } =
        await vaultData.getVaultData(connection, vaultAddress);

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

      const lockedBalanceInAsset = totalQueueDeposit.sub(totalQueueWithdrawal);
      const depositBalanceInAsset = totalQueueDeposit;

      console.log(vault);

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
  }, [vault, client, connection]);

  return data || defaultSolanaVaultData;
};

export default useFetchSolVaultData;