import { useEffect, useState } from "react";
import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { Vault, Flex, VaultClient, vaultUtils } from "@zetamarkets/flex-sdk";
import useWeb3Wallet from "./useWeb3Wallet";
import { getSolanaAddresses, getSolanaNetwork } from "../utils/env";
import { Vault as VaultInterface } from "@zetamarkets/flex-sdk/dist/vault/types";
import { Wallet } from "@zetamarkets/flex-sdk/dist/common/types";

interface FlexVaultData {
  client: VaultClient | null;
  vault: VaultInterface | null;
}

export const useFlexVault = (): FlexVaultData => {
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  const network = getSolanaNetwork();
  const { flex: flexAddress, vault: solAddress } = getSolanaAddresses();

  const [flexClient, setFlexClient] = useState<VaultClient | null>(null);
  const [flexVault, setFlexVault] = useState<VaultInterface | null>(null);

  // FLEX VAULT HANDLER
  useEffect(() => {
    const loadFlexVault = async () => {
      return await Promise.all([
        Flex.load(new PublicKey(flexAddress), network, connection),
        Vault.load(new PublicKey(solAddress), network, connection),
      ]).then(async () => {
        const [vaultAddress] = await vaultUtils.getVaultAddress("rSOL-THETA");
        return await Vault.getVault(new PublicKey(vaultAddress));
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
  }, [connection, flexVault, Flex, Vault]);

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

  return { vault: flexVault, client: flexClient };
};
