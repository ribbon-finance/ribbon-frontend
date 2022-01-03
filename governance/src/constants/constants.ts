import { CHAINID, isDevelopment } from "shared/lib/utils/env";
import address from "./deployments.json";

export const GovernanceChainID = isDevelopment()
  ? CHAINID.ETH_KOVAN
  : CHAINID.ETH_MAINNET;

export const IncentivizedVotingLockupAddress = isDevelopment()
  ? address.kovan.RBNIncentivisedVotingLockup
  : "";
