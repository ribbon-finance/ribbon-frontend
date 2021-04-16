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

export const getWBTCThetaVaultId = () => {
  return isStaging()
    ? deployment.kovan.RibbonWBTCCoveredCall
    : deployment.kovan.RibbonWBTCCoveredCall; // TODO:
};

export const VaultList = ["rETH-THETA", "rBTC-THETA"] as const;
export type VaultOptions = typeof VaultList[number];

export const VaultAddressMap: { [vault in VaultOptions]: () => string } = {
  "rETH-THETA": getETHThetaVaultId,
  "rBTC-THETA": getWBTCThetaVaultId,
};

export const VaultNamesList = ["T-100-ETH", "T-100-WBTC"] as const;
export type VaultName = typeof VaultNamesList[number];
export const VaultNameOptionMap: { [name in VaultName]: VaultOptions } = {
  "T-100-ETH": "rETH-THETA",
  "T-100-WBTC": "rBTC-THETA",
};

export const getEtherscanURI = () =>
  isStaging() ? "https://kovan.etherscan.io" : "https://etherscan.io";
