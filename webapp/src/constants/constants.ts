import { CHAINID, isChainIdEnabled, isDevelopment } from "shared/lib/utils/env";
import {
  VaultNameOptionMap,
  VaultOptions,
  VaultVersion,
} from "shared/lib/constants/constants";
import { Airdrop, AirdropBreakdown, AirdropProof } from "../models/airdrop";
import { Assets } from "shared/lib/store/types";

export const proof: AirdropProof = isDevelopment()
  ? require("../data/proof-kovan.json")
  : require("../data/proof.json");

export const airdrop: Airdrop = isDevelopment()
  ? require("../data/airdrop-kovan.json")
  : require("../data/airdrop.json");

export const breakdown: AirdropBreakdown = isDevelopment()
  ? require("../data/breakdown-kovan.json")
  : require("../data/breakdown.json");

export const getVaultURI = (
  vaultOption: VaultOptions,
  vaultVersion: VaultVersion = "v1"
): string => {
  switch (vaultVersion) {
    case "v1":
      return `/theta-vault/${
        Object.keys(VaultNameOptionMap)[
          Object.values(VaultNameOptionMap).indexOf(vaultOption)
        ]
      }`;
    case "v2":
      return `/v2/theta-vault/${
        Object.keys(VaultNameOptionMap)[
          Object.values(VaultNameOptionMap).indexOf(vaultOption)
        ]
      }`;
  }
};

interface Announcement {
  color: string;
  message: string;
  linkText: string;
  linkURI: string;
}

export const ANNOUNCEMENT: Announcement | undefined = isChainIdEnabled(
  CHAINID.AURORA_MAINNET
)
  ? {
      color: "#FFFFFF",
      message: "Near vaults have launched.",
      linkText: "Switch to Aurora",
      linkURI: "/",
    }
  : undefined;

export enum Chains {
  NotSelected,
  Ethereum,
  Avalanche,
  Solana,
}

export const READABLE_CHAIN_NAMES: Record<Chains, string> = {
  [Chains.Ethereum]: "Ethereum",
  [Chains.Avalanche]: "Avalanche",
  [Chains.Solana]: "Solana",
  [Chains.NotSelected]: "No Chain Selected",
};

export const ENABLED_CHAINS: Chains[] = [
  Chains.Ethereum,
  Chains.Avalanche,
  Chains.Solana,
];

export const CHAINS_TO_NATIVE_TOKENS: Record<Chains, Assets> = {
  [Chains.Ethereum]: "WETH",
  [Chains.Avalanche]: "WAVAX",
  [Chains.Solana]: "SOL",
  [Chains.NotSelected]: "WETH",
};

export const CHAINS_TO_ID: Record<number, number> = {
  [Chains.Ethereum]: isDevelopment() ? CHAINID.ETH_KOVAN : CHAINID.ETH_MAINNET,
  [Chains.Avalanche]: isDevelopment()
    ? CHAINID.AVAX_FUJI
    : CHAINID.AVAX_MAINNET,
};
