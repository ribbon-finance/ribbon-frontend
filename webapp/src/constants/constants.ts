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

export const getETHThetaVaultId = () => {
  return (isStaging()
    ? deployment.kovan.RibbonETHCoveredCall
    : deployment.mainnet.RibbonETHCoveredCall
  ).toLowerCase();
};

export const VaultList = ["rETH-THETA"] as const;
export type VaultOptions = typeof VaultList[number];

export const VaultAddressMap: { [vault in VaultOptions]: () => string } = {
  "rETH-THETA": getETHThetaVaultId,
};

export const VaultNamesList = ["T-100-E"] as const;
export type VaultName = typeof VaultNamesList[number];
export const VaultNameOptionMap: { [name in VaultName]: VaultOptions } = {
  "T-100-E": "rETH-THETA",
};

export const getEtherscanURI = () =>
  isStaging() ? "https://kovan.etherscan.io" : "https://etherscan.io";
