import { isDevelopment } from "shared/lib/utils/env";
import { Airdrop, AirdropBreakdown, AirdropProof } from "../models/airdrop";

export const proof: AirdropProof = isDevelopment()
  ? require("../data/proof-kovan.json")
  : require("../data/proof.json");

export const airdrop: Airdrop = isDevelopment()
  ? require("../data/airdrop-kovan.json")
  : require("../data/airdrop-kovan.json");

export const breakdown: AirdropBreakdown = isDevelopment()
  ? require("../data/breakdown-kovan.json")
  : require("../data/breakdown.json");
