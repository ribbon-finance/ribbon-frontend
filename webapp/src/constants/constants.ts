import { isStaging } from "../utils/env";
import deployment from "./deployments.json";

export const NETWORK_NAMES: Record<number, string> = {
  1: "mainnet",
  42: "kovan",
};

export const GAS_LIMITS = {
  depositETH: 80000,
  withdrawETH: 100000,
};

export const getETHThetaVaultId = () =>
  (isStaging()
    ? deployment.kovan.RibbonETHCoveredCall
    : deployment.mainnet.RibbonETHCoveredCall
  ).toLowerCase();

const VaultList = ["ETH-THETA"] as const;
export type VaultOptions = typeof VaultList[number];

export const VaultAddressMap: { [vault in VaultOptions]: () => string } = {
  "ETH-THETA": getETHThetaVaultId,
};

export const getEtherscanURI = () =>
  isStaging() ? "https://kovan.etherscan.io" : "https://etherscan.io";
