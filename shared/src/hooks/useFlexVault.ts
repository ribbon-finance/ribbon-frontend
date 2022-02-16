import { useEffect, useState } from "react";
import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import {
  Vault,
  Flex,
  VaultClient,
  vaultUtils,
  vaultTypes,
} from "@zetamarkets/flex-sdk";
import {
  getSolanaAddresses,
  getSolanaNetwork,
  isProduction,
} from "../utils/env";
import { Vault as VaultInterface } from "@zetamarkets/flex-sdk/dist/vault/types";
import { Wallet } from "@zetamarkets/flex-sdk/dist/common/types";

interface FlexVaultData {
  client: VaultClient | null;
  vault: vaultTypes.Vault | null;
  update: () => void;
}

export const useFlexVault = (): FlexVaultData => {
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  const network = getSolanaNetwork();
  const { flex: flexAddress, vault: vaultProgramId } = getSolanaAddresses();

  const [flexClient, setFlexClient] = useState<VaultClient | null>(null);
  const [flexVault, setFlexVault] = useState<vaultTypes.Vault | null>(null);

  // FLEX VAULT INITIALIZER
  useEffect(() => {
    if (!isProduction()) {
      console.time("SOL Vault Data Fetch");
    }

    const pollingInterval = flexVault ? 10000 : 3000;

    const setVault = setInterval(async () => {
      if (Flex.isInitialized && Vault.isInitialized) {
        const [vaultAddress] = await vaultUtils.getVaultAddress("rSOL-THETA");
        setFlexVault(Vault.getVault(new PublicKey(vaultAddress)));
      }
    }, pollingInterval);

    return () => {
      if (!isProduction()) {
        console.timeEnd("SOL Vault Data Fetch");
      }

      clearInterval(setVault);
    };
  }, [flexVault]);

  // FLEX VAULT HANDLER
  useEffect(() => {
    const loadFlexVault = async () => {
      return await Promise.all([
        Flex.load(new PublicKey(flexAddress), network, connection),
        Vault.load(new PublicKey(vaultProgramId), network, connection),
      ]).then(async () => {
        const [vaultAddress] = await vaultUtils.getVaultAddress("rSOL-THETA");
        return Vault.getVault(new PublicKey(vaultAddress));
      });
    };

    if (
      !Flex.isInitialized &&
      !Vault.isInitialized &&
      !flexVault &&
      connection
    ) {
      loadFlexVault().then((vault: VaultInterface) => {
        setFlexVault(vault);
      });
    }
  }, [connection, flexVault, flexAddress, network, vaultProgramId]);

  // FLEX CLIENT HANDLER
  useEffect(() => {
    const loadFlexClient = async () => {
      return await VaultClient.load(connection, anchorWallet as Wallet);
    };

    if (anchorWallet && !flexClient && connection) {
      loadFlexClient().then((client: VaultClient) => {
        setFlexClient(client);
      });
    }
  }, [anchorWallet, connection, flexClient]);

  const update = () => {
    if (Flex) Flex.updateState();
  };

  return { vault: flexVault, client: flexClient, update } as FlexVaultData;
};
