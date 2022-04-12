import { isDevelopment } from "shared/lib/utils/env";
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

export const proof: AirdropProof = isDevelopment() ? ProofKovanData : ProofData;

export const airdrop: Airdrop = isDevelopment()
  ? AirdropKovanData
  : AirdropData;

export const breakdown: AirdropBreakdown = isDevelopment()
  ? BreakdownKovanData
  : BreakdownData;

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
