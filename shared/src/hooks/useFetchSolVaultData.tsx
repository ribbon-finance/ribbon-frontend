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
} from "@zetamarkets/flex-sdk";
import { DummyWallet } from "@zetamarkets/flex-sdk/dist/common/types";
import { defaultSolanaVaultData, SolanaVaultData } from "../models/vault";
import { BigNumber } from "@ethersproject/bignumber";

const flexProgramId = "5z75LKcF49JavDVW1hsGceDDBRHkja6RbRsouXQHBBjG";
const vaultProgramId = "CvtFQpTX8TqVbRQ6UrwPzwnrfrzYkwyEBu74M2vG46sf";

let baseAccount = Keypair.generate();

const useFetchSolVaultData = (): SolanaVaultData => {
  const { connection } = useConnection();
  const { loadedVault } = useFlexVault();
  const [data, setData] = useState<SolanaVaultData>(defaultSolanaVaultData);

  const doMulticall = useCallback(async () => {
    if (!loadedVault) return;

    const [vaultPubKey] = await vaultUtils.getVaultAddress("TEST_VAULT");
    const vaultInfo = Vault.getVault(vaultPubKey);

    const vaultTokenAccountInfo = await utils.getTokenAccountInfo(
      connection,
      vaultInfo.vaultUnderlyingTokenAccount
    );

    const totalBalance = BigNumber.from(
      vaultTokenAccountInfo.amount.toString()
    );

    setData({
      responses: {
        "rSOL-THETA": {
          totalBalance,
          cap: BigNumber.from(0),
          pricePerShare: BigNumber.from(0),
          round: 1,
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

const useFlexVault = () => {
  const { connection } = useConnection();
  const [loadedVault, setLoadedVault] = useState(false);

  useEffect(() => {
    const loadFlexVault = async () => {
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

    if (!loadedVault && connection) {
      loadFlexVault();
    }
  }, [connection, loadedVault]);

  return { loadedVault };
};

export default useFetchSolVaultData;
