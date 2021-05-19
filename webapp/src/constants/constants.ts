import { isStaging } from "shared/lib/utils/env";
import { Airdrop, AirdropBreakdown, AirdropProof } from "../models/airdrop";

export const proof: AirdropProof = isStaging()
  ? require("../data/proof-kovan.json")
  : require("../data/proof.json");

export const airdrop: Airdrop = isStaging()
  ? require("../data/airdrop-kovan.json")
  : require("../data/airdrop-kovan.json");

export const breakdown: AirdropBreakdown = isStaging()
  ? require("../data/breakdown-kovan.json")
  : require("../data/breakdown.json");
