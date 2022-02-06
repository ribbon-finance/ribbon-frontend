import { useCallback, useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { vaultUtils, vaultData } from "@zetamarkets/flex-sdk";
import { defaultSolanaVaultData, SolanaVaultData } from "../models/vault";
import { BigNumber } from "@ethersproject/bignumber";
import { parseUnits } from "ethers/lib/utils";
import { getAssetDecimals } from "../utils/asset";
import { useFlexVault } from "./useFlexVault";

const useFetchSolVaultData = (): SolanaVaultData => {
  const { connection } = useConnection();
  const { loadedVault } = useFlexVault();
  const [data, setData] = useState<SolanaVaultData>(defaultSolanaVaultData);

  const doMulticall = useCallback(async () => {
    if (!loadedVault) return;

    const [vaultAddress] = await vaultUtils.getVaultAddress("TEST_VAULT");

    const { depositLimit, epochSequenceNumber, totalBalance, pricePerShare } =
      await vaultData.getVaultData(connection, vaultAddress);

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
            round: 0,
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
