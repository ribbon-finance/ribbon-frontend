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
  // TODO: Update gas limit
  "rBTC-THETA-P": {
    deposit: 100000,
    withdraw: 140000,
  },
  // TODO: Update gas limit
  "rETH-THETA-P": {
    deposit: 100000,
    withdraw: 140000,
  },
};

const getETHThetaVaultId = () =>
  (isStaging()
    ? deployment.kovan.RibbonETHCoveredCall
    : deployment.mainnet.RibbonETHCoveredCall
  ).toLowerCase();

const getWBTCThetaVaultId = () =>
  (isStaging()
    ? deployment.kovan.RibbonWBTCCoveredCall
    : deployment.mainnet.RibbonWBTCCoveredCall
  ).toLowerCase();

const getWBTCPutThetaVaultId = () =>
  isStaging()
    ? deployment.kovan.RibbonWBTCPut
    : // TODO: Update mainnet address
      deployment.kovan.RibbonWBTCPut;

const getETHPutThetaVaultId = () =>
  isStaging()
    ? deployment.kovan.RibbonETHPut
    : // TODO: Update mainnet address
      deployment.kovan.RibbonETHPut;

const FullVaultList = [
  "rBTC-THETA-P",
  "rETH-THETA-P",
  "rBTC-THETA",
  "rETH-THETA",
] as const;
export type VaultOptions = typeof FullVaultList[number];
const ProdExcludeVault: VaultOptions[] = ["rBTC-THETA-P", "rETH-THETA-P"];
// @ts-ignore
export const VaultList: VaultOptions[] = isStaging()
  ? FullVaultList
  : FullVaultList.filter((vault) => !ProdExcludeVault.includes(vault));

export const VaultAddressMap: { [vault in VaultOptions]: () => string } = {
  "rBTC-THETA-P": getWBTCPutThetaVaultId,
  "rETH-THETA-P": getETHPutThetaVaultId,
  "rETH-THETA": getETHThetaVaultId,
  "rBTC-THETA": getWBTCThetaVaultId,
};

export const VaultNamesList = [
  "T-WBTC-P",
  "T-ETH-P",
  "T-ETH-C",
  "T-WBTC-C",
] as const;
export type VaultName = typeof VaultNamesList[number];
export const VaultNameOptionMap: { [name in VaultName]: VaultOptions } = {
  "T-WBTC-P": "rBTC-THETA-P",
  "T-ETH-P": "rETH-THETA-P",
  "T-ETH-C": "rETH-THETA",
  "T-WBTC-C": "rBTC-THETA",
};

export const getEtherscanURI = () =>
  isStaging() ? "https://kovan.etherscan.io" : "https://etherscan.io";

export const getAssets = (vault: VaultOptions): Assets => {
  switch (vault) {
    case "rETH-THETA-P":
    case "rBTC-THETA-P":
      return "USDC";
    case "rETH-THETA":
      return "WETH";
    case "rBTC-THETA":
      return "WBTC";
  }
};

export const VaultMaxDeposit: { [vault in VaultOptions]: BigNumber } = {
  // TODO: Update vault deposit limit
  "rBTC-THETA-P": BigNumber.from(500000).mul(
    BigNumber.from(10).pow(getAssetDecimals(getAssets("rBTC-THETA-P")))
  ),
  // TODO: Update vault deposit limit
  "rETH-THETA-P": BigNumber.from(500000).mul(
    BigNumber.from(10).pow(getAssetDecimals(getAssets("rETH-THETA-P")))
  ),
  "rETH-THETA": BigNumber.from(1000).mul(
    BigNumber.from(10).pow(getAssetDecimals(getAssets("rETH-THETA")))
  ),
  "rBTC-THETA": BigNumber.from(10).mul(
    BigNumber.from(10).pow(getAssetDecimals(getAssets("rBTC-THETA")))
  ),
};

export const getAirtableName = (vault: VaultOptions): string => {
  switch (vault) {
    case "rBTC-THETA-P":
      return "T-100-ETH"; // TODO: Replace airtable name
    case "rETH-THETA-P":
      return "T-100-ETH"; // TODO: Replace airtable name
    case "rETH-THETA":
      return "T-100-ETH";
    case "rBTC-THETA":
      return "T-100-WBTC";
  }
};
