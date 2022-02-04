import { CHAINID, isChainIdEnabled, isDevelopment } from "shared/lib/utils/env";
import {
  VaultNameOptionMap,
  VaultOptions,
  VaultVersion,
} from "shared/lib/constants/constants";
import { Airdrop, AirdropBreakdown, AirdropProof } from "../models/airdrop";
import ProofKovanData from "../data/proof-kovan.json";
import ProofData from "../data/proof.json";
import AirdropKovanData from "../data/airdrop-kovan.json";
import AirdropData from "../data/airdrop.json";
import BreakdownKovanData from "../data/breakdown-kovan.json";
import BreakdownData from "../data/breakdown.json";

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
