import { BigNumber } from "@ethersproject/bignumber";
import { Assets } from "../store/types";
import { getAssetDecimals } from "../utils/asset";
import { isDevelopment } from "../utils/env";
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
  "rUSDC-BTC-P-THETA": {
    deposit: 120000,
    withdraw: 120000,
  },
  "rUSDC-ETH-P-THETA": {
    deposit: 120000,
    withdraw: 120000,
  },
};

const getETHThetaVaultId = () =>
  (isDevelopment()
    ? deployment.kovan.RibbonETHCoveredCall
    : deployment.mainnet.RibbonETHCoveredCall
  ).toLowerCase();

const getWBTCThetaVaultId = () =>
  (isDevelopment()
    ? deployment.kovan.RibbonWBTCCoveredCall
    : deployment.mainnet.RibbonWBTCCoveredCall
  ).toLowerCase();

const getWBTCPutThetaVaultId = () =>
  isDevelopment()
    ? deployment.kovan.RibbonWBTCPut
    : // TODO: Update mainnet address
      deployment.kovan.RibbonWBTCPut;

const getETHPutThetaVaultId = () =>
  isDevelopment()
    ? deployment.kovan.RibbonETHPut
    : deployment.mainnet.RibbonETHPut;

const FullVaultList = [
  "rUSDC-ETH-P-THETA",
  "rUSDC-BTC-P-THETA",
  "rBTC-THETA",
  "rETH-THETA",
] as const;
export type VaultOptions = typeof FullVaultList[number];
const ProdExcludeVault: VaultOptions[] = ["rUSDC-BTC-P-THETA"];
const PutThetaVault: VaultOptions[] = [
  "rUSDC-BTC-P-THETA",
  "rUSDC-ETH-P-THETA",
];
// @ts-ignore
export const VaultList: VaultOptions[] = isDevelopment()
  ? FullVaultList
  : FullVaultList.filter((vault) => !ProdExcludeVault.includes(vault));

export const isPutVault = (vault: VaultOptions): boolean =>
  PutThetaVault.includes(vault);

export const VaultAddressMap: { [vault in VaultOptions]: () => string } = {
  "rUSDC-ETH-P-THETA": getETHPutThetaVaultId,
  "rUSDC-BTC-P-THETA": getWBTCPutThetaVaultId,
  "rETH-THETA": getETHThetaVaultId,
  "rBTC-THETA": getWBTCThetaVaultId,
};

export const VaultNamesList = [
  "T-USDC-P-ETH",
  "T-USDC-P-WBTC",
  "T-ETH-C",
  "T-WBTC-C",
] as const;
export type VaultName = typeof VaultNamesList[number];
export const VaultNameOptionMap: { [name in VaultName]: VaultOptions } = {
  "T-USDC-P-ETH": "rUSDC-ETH-P-THETA",
  "T-USDC-P-WBTC": "rUSDC-BTC-P-THETA",
  "T-ETH-C": "rETH-THETA",
  "T-WBTC-C": "rBTC-THETA",
};

export const getEtherscanURI = () =>
  isDevelopment() ? "https://kovan.etherscan.io" : "https://etherscan.io";

export const getAssets = (vault: VaultOptions): Assets => {
  switch (vault) {
    case "rUSDC-ETH-P-THETA":
    case "rUSDC-BTC-P-THETA":
      return "USDC";
    case "rETH-THETA":
      return "WETH";
    case "rBTC-THETA":
      return "WBTC";
  }
};

export const getOptionAssets = (vault: VaultOptions): Assets => {
  switch (vault) {
    case "rBTC-THETA":
    case "rUSDC-BTC-P-THETA":
      return "WBTC";
    case "rETH-THETA":
    case "rUSDC-ETH-P-THETA":
      return "WETH";
  }
};

export const VaultMaxDeposit: { [vault in VaultOptions]: BigNumber } = {
  "rUSDC-BTC-P-THETA": BigNumber.from(500000).mul(
    BigNumber.from(10).pow(getAssetDecimals(getAssets("rUSDC-BTC-P-THETA")))
  ),
  "rUSDC-ETH-P-THETA": BigNumber.from(1000000).mul(
    BigNumber.from(10).pow(getAssetDecimals(getAssets("rUSDC-ETH-P-THETA")))
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
    case "rUSDC-ETH-P-THETA":
      return "T-USDC-P-ETH";
    case "rUSDC-BTC-P-THETA":
      return "T-USDC-P-WBTC";
    case "rETH-THETA":
      return "T-ETH-C";
    case "rBTC-THETA":
      return "T-WBTC-C";
  }
};
