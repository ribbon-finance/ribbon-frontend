import { CHAINID, isDevelopment } from "shared/lib/utils/env";
import address from "./deployments.json";

export const GovernanceChainID = isDevelopment()
  ? CHAINID.ETH_KOVAN
  : CHAINID.ETH_MAINNET;

export const VotingEscrowAddress = isDevelopment()
  ? address.kovan.RBNVotingEscrow
  : address.mainnet.RBNVotingEscrow;

export const VotingEscrowDelegationProxyAddress = isDevelopment()
  ? address.kovan.RBNVotingEscrowDelegationProxy
  : address.mainnet.RBNVotingEscrowDelegationProxy;
