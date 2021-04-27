import { BigNumber } from "@ethersproject/bignumber";
import { Assets } from "../store/types";
import { getAssetDecimals } from "../utils/asset";
import { isStaging } from "../utils/env";
import deployment from "./deployments.json";

export const NETWORK_NAMES: Record<number, string> = {
  1: "mainnet",
  42: "kovan",
};

export const GAS_LIMITS: {
  [vault in VaultOptions]: { deposit: number; withdraw: number };
} = {
  "rETH-THETA": {
    deposit: 80000,
    withdraw: 100000,
  },
  "rBTC-THETA": {
    deposit: 100000,
    withdraw: 140000,
  },
};

export const getETHThetaVaultId = () => {
  return (isStaging()
    ? deployment.kovan.RibbonETHCoveredCall
    : deployment.mainnet.RibbonETHCoveredCall
  ).toLowerCase();
};

export const getWBTCThetaVaultId = () => {
  return (isStaging()
    ? deployment.kovan.RibbonWBTCCoveredCall
    : deployment.mainnet.RibbonWBTCCoveredCall
  ).toLowerCase();
};

export const FullVaultList = ["rBTC-THETA", "rETH-THETA"] as const;
export type VaultOptions = typeof FullVaultList[number];
export const ProdExcludeVault: VaultOptions[] = ["rBTC-THETA"];
// @ts-ignore
export const VaultList: VaultOptions[] = isStaging()
  ? FullVaultList
  : FullVaultList.filter((vault) => !ProdExcludeVault.includes(vault));

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

export const getAssets = (vault: VaultOptions): Assets => {
  switch (vault) {
    case "rETH-THETA":
      return "WETH";
    case "rBTC-THETA":
      return "WBTC";
  }
};

export const VaultMaxDeposit: { [vault in VaultOptions]: BigNumber } = {
  "rETH-THETA": BigNumber.from(200).mul(
    BigNumber.from(10).pow(getAssetDecimals(getAssets("rETH-THETA")))
  ),
  "rBTC-THETA": BigNumber.from(10).mul(
    BigNumber.from(10).pow(getAssetDecimals(getAssets("rBTC-THETA")))
  ),
};

export const getAirtableName = (vault: VaultOptions): string => {
  switch (vault) {
    case "rETH-THETA":
      return "T-100-ETH";
    case "rBTC-THETA":
      return "T-100-WBTC";
  }
};
