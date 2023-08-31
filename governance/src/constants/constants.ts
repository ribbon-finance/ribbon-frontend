import { isDevelopment } from "shared/lib/utils/env";
import { CHAINID } from "shared/lib/constants/constants";
export const GovernanceChainID = isDevelopment()
  ? CHAINID.ETH_KOVAN
  : CHAINID.ETH_MAINNET;
