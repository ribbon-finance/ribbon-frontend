import { isDevelopment } from "shared/lib/utils/env";
import {
  VaultNameOptionMap,
  VaultOptions,
  VaultVersion,
} from "shared/lib/constants/constants";
import { Airdrop, AirdropBreakdown, AirdropProof } from "../models/airdrop";

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

export const ANNOUNCEMENT: Announcement | undefined = {
  color: "#E84142",
  message: "AVAX vaults are open.",
  linkText: "Switch to Avalanche",
  linkURI: "/",
};
