import { useCallback, useEffect, useState } from "react";
import * as anchor from "@project-serum/anchor";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, Keypair } from "@solana/web3.js";
import {
  vaultProgramTypes,
  Network,
  Vault,
  Flex,
  FlexClient,
  flexUtils,
  VaultClient,
  vaultUtils,
  vaultTypes,
  flexProgramTypes,
  flexTypes,
  types,
  utils,
  vaultData,
} from "@zetamarkets/flex-sdk";
import { DummyWallet } from "@zetamarkets/flex-sdk/dist/common/types";
import { defaultSolanaVaultData, SolanaVaultData } from "../models/vault";
import { BigNumber } from "@ethersproject/bignumber";
import { parseUnits } from "ethers/lib/utils";
import { getAssetDecimals } from "../utils/asset";

const flexProgramId = "5z75LKcF49JavDVW1hsGceDDBRHkja6RbRsouXQHBBjG";
const vaultProgramId = "CvtFQpTX8TqVbRQ6UrwPzwnrfrzYkwyEBu74M2vG46sf";

let baseAccount = Keypair.generate();

const useFetchSolVaultData = (): SolanaVaultData => {
  const { connection } = useConnection();
  const { loadedVault } = useFlexVault();
  const [data, setData] = useState<SolanaVaultData>(defaultSolanaVaultData);

  const doMulticall = useCallback(async () => {
    if (!loadedVault) return;

    const [vaultAddress] = await vaultUtils.getVaultAddress("TEST_VAULT");
    const vaultInfo = Vault.getVault(vaultAddress);

    const vaultTokenAccountInfo = await utils.getTokenAccountInfo(
      connection,
      vaultInfo.vaultUnderlyingTokenAccount
    );

    const { depositLimit, epochSequenceNumber, totalBalance, pricePerShare } =
      await vaultData.getVaultData(connection, vaultAddress);

    console.log({
      depositLimit,
      epochSequenceNumber,
      totalBalance,
      pricePerShare,
    });

    setData({
      responses: {
        "rSOL-THETA": {
          totalBalance: BigNumber.from(totalBalance),
          cap: BigNumber.from(depositLimit),
          pricePerShare: parseUnits(
            pricePerShare.toFixed(getAssetDecimals("SOL")),
            getAssetDecimals("SOL")
          ),
          round: epochSequenceNumber,
          lockedBalanceInAsset: BigNumber.from(0),
          depositBalanceInAsset: BigNumber.from(0),
          withdrawals: {
            round: 1,
            amount: BigNumber.from(0),
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

let loadingOnce = false;

const useFlexVault = () => {
  const { connection } = useConnection();
  const [loadedVault, setLoadedVault] = useState(false);

  useEffect(() => {
    const loadFlexVault = async () => {
      loadingOnce = true;

      await Flex.load(
        new PublicKey(flexProgramId),
        Network.LOCALNET,
        connection
      );
      await FlexClient.load(connection, new types.DummyWallet());

      await Vault.load(
        new PublicKey(vaultProgramId),
        Network.LOCALNET,
        connection
      );
      setLoadedVault(true);
    };

    if (!loadingOnce && !loadedVault && connection) {
      loadFlexVault();
    }
  }, [connection, loadedVault]);

  return { loadedVault };
};

export default useFetchSolVaultData;
