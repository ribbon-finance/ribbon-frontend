import { useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { vaultUtils, vaultData } from "@zetamarkets/flex-sdk";
import { defaultSolanaVaultData, SolanaVaultData } from "../models/vault";
import { BigNumber } from "@ethersproject/bignumber";
import { parseUnits } from "ethers/lib/utils";
import { getAssetDecimals } from "../utils/asset";
import { useFlexVault } from "./useFlexVault";
import { PublicKey, Keypair } from "@solana/web3.js";
import {
  getSOLPricePerShare,
  getUserDepositQueueAmount,
  getUserWithdrawQueueAmount,
} from "../utils/vault";
import { TOKEN_PROGRAM_ID, Token } from "@solana/spl-token";
import useWeb3Wallet from "./useWeb3Wallet";

const useFetchSolVaultData = (): SolanaVaultData => {
  const { connection } = useConnection();
  const { vault, client } = useFlexVault();
  const { publicKey } = useWeb3Wallet();
  const [data, setData] = useState<SolanaVaultData>();

  useEffect(() => {
    const doMulticall = async () => {
      // Should always set loading to false when no vault and no conection
      if (!vault || !connection) {
        setData({
          ...defaultSolanaVaultData,
          loading: false,
        });
        return;
      }

      const [vaultAddress] = await vaultUtils.getVaultAddress("rSOL-THETA");
      const { depositLimit, epochSequenceNumber, totalBalance, pricePerShare } =
        await vaultData.getVaultData(connection, vaultAddress);

      let lockedBalanceInAsset = BigNumber.from(0);
      let depositBalanceInAsset = BigNumber.from(0);
      let totalQueuedWithdrawals = BigNumber.from(0);
      const totalQueuedDeposits = BigNumber.from(vault.totalQueuedDeposits);

      if (publicKey) {
        totalQueuedWithdrawals = getUserWithdrawQueueAmount(
          vault,
          publicKey as PublicKey
        );

        depositBalanceInAsset = getUserDepositQueueAmount(
          vault,
          publicKey as PublicKey
        );

        lockedBalanceInAsset = BigNumber.from(0);

        const token = new Token(
          connection,
          vault?.redeemableMint,
          TOKEN_PROGRAM_ID,
          Keypair.generate()
        ); // "payer" is a Keypair or other Signer

        const associatedTokenAccounts =
          await connection.getTokenAccountsByOwner(publicKey, {
            mint: vault?.redeemableMint,
            programId: TOKEN_PROGRAM_ID,
          });

        let redeemableAmount = BigNumber.from(0);

        for (let tokenAccountInfo of associatedTokenAccounts.value) {
          const detailedAccountInfo = await token.getAccountInfo(
            tokenAccountInfo.pubkey
          );

          if (detailedAccountInfo.mint.equals(vault?.redeemableMint)) {
            redeemableAmount = redeemableAmount.add(
              BigNumber.from(detailedAccountInfo.amount.toString())
            );
          }
        }

        const pricePerShare = await getSOLPricePerShare();
        lockedBalanceInAsset = BigNumber.from(
          Math.round(parseFloat(redeemableAmount.toString()) * pricePerShare)
        );
      }

      setData({
        responses: {
          "rSOL-THETA": {
            totalBalance: BigNumber.from(totalBalance).add(totalQueuedDeposits),
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
            depositBalanceInAsset: BigNumber.from(depositBalanceInAsset),
            withdrawals: {
              round: BigNumber.from(totalQueuedWithdrawals).isZero()
                ? 0
                : epochSequenceNumber,
              shares: BigNumber.from(totalQueuedWithdrawals),
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
