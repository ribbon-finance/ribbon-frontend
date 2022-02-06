import { useEffect, useState } from "react";
import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { Network, Vault, Flex, VaultClient } from "@zetamarkets/flex-sdk";
import useWeb3Wallet from "./useWeb3Wallet";

let loadedOnce = false;

const FLEX_PROGRAM_ID = "zFLEX6CVSPJgCwnYPYWSJFzYAC3RbP7vSoc75R88P6C";
const SOL_VAULT_ID = "RBN2XNc6JQU6ewFp9TyPq6WznsvNuumzSJkor1nJFcz";

interface FlexVaultData {
  vaultClient: VaultClient | null;
}

export const useFlexVault = () => {
  const { connection } = useConnection();
  const [loadedVault, setLoadedVault] = useState(false);
  const { solanaWallet } = useWeb3Wallet();
  const anchorWallet = useAnchorWallet();

  const [flexVaultData, setFlexVaultData] = useState<FlexVaultData>({
    vaultClient: null,
  });

  useEffect(() => {
    const loadFlexVault = async () => {
      loadedOnce = true;

      await Flex.load(
        new PublicKey(FLEX_PROGRAM_ID),
        Network.DEVNET,
        connection
      );

      await Vault.load(new PublicKey(SOL_VAULT_ID), Network.DEVNET, connection);

      setLoadedVault(true);
    };

    if (!loadedOnce && !loadedVault && connection) {
      loadFlexVault();
    }
  }, [connection, loadedVault, flexVaultData]);

  useEffect(() => {
    if (loadedVault && anchorWallet && solanaWallet) {
      (async () => {
        const vaultClient = await VaultClient.load(connection, anchorWallet);
        setFlexVaultData({ vaultClient });
      })();
    }
  }, [loadedVault, anchorWallet, solanaWallet, connection]);

  return { loadedVault, data: flexVaultData };
};
