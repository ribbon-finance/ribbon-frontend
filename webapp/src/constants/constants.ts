import { isDevelopment } from "shared/lib/utils/env";
import {
  VaultNameOptionMap,
  VaultOptions,
  VaultVersion,
  VaultVersionList,
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
  variant: VaultVersion = VaultVersionList[0]
): string => {
  switch (variant) {
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
