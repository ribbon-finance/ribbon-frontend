import { useCallback, useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import {
  Network,
  Vault,
  Flex,
  vaultUtils,
  vaultData,
} from "@zetamarkets/flex-sdk";
import { defaultSolanaVaultData, SolanaVaultData } from "../models/vault";
import { BigNumber } from "@ethersproject/bignumber";
import { parseUnits } from "ethers/lib/utils";
import { getAssetDecimals } from "../utils/asset";

const flexProgramId = "zFLEX6CVSPJgCwnYPYWSJFzYAC3RbP7vSoc75R88P6C";
const vaultProgramId = "RBN2XNc6JQU6ewFp9TyPq6WznsvNuumzSJkor1nJFcz";

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

let loadedOnce = false;

const useFlexVault = () => {
  const { connection } = useConnection();
  const [loadedVault, setLoadedVault] = useState(false);

  useEffect(() => {
    const loadFlexVault = async () => {
      loadedOnce = true;

      await Flex.load(new PublicKey(flexProgramId), Network.DEVNET, connection);

      await Vault.load(
        new PublicKey(vaultProgramId),
        Network.DEVNET,
        connection
      );
      setLoadedVault(true);
    };

    if (!loadedOnce && !loadedVault && connection) {
      loadFlexVault();
    }
  }, [connection, loadedVault]);

  return { loadedVault };
};

export default useFetchSolVaultData;
