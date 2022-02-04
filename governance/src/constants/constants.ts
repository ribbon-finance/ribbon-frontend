import { CHAINID, isDevelopment } from "shared/lib/utils/env";

export const GovernanceChainID = isDevelopment()
  ? CHAINID.ETH_KOVAN
  : CHAINID.ETH_MAINNET;
