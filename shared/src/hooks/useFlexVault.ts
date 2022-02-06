import { useEffect, useState } from "react";
import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { Vault, Flex, VaultClient } from "@zetamarkets/flex-sdk";
import useWeb3Wallet from "./useWeb3Wallet";
import { getSolanaAddresses, getSolanaNetwork } from "../utils/env";

let loadedOnce = false;

interface FlexVaultData {
  vaultClient: VaultClient | null;
}

export const useFlexVault = () => {
  const { connection } = useConnection();
  const [loadedVault, setLoadedVault] = useState(false);
  const { solanaWallet } = useWeb3Wallet();
  const anchorWallet = useAnchorWallet();
  const { flex: flexAddress, vault: vaultAddress } = getSolanaAddresses();

  const [flexVaultData, setFlexVaultData] = useState<FlexVaultData>({
    vaultClient: null,
  });

  useEffect(() => {
    const loadFlexVault = async () => {
      loadedOnce = true;

      const network = getSolanaNetwork();
      await Flex.load(new PublicKey(flexAddress), network, connection);
      await Vault.load(new PublicKey(vaultAddress), network, connection);

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
