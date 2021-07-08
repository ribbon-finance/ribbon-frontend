import { BigNumber } from "@ethersproject/bignumber";
import { Assets } from "../store/types";
import { getAssetDecimals } from "../utils/asset";
import { isDevelopment, isProduction } from "../utils/env";
import deployment from "./deployments.json";

export const NETWORK_NAMES: Record<number, string> = {
  1: "mainnet",
  42: "kovan",
};

export const FullVaultList = [
  "ryvUSDC-ETH-P-THETA",
  "rETH-THETA",
  "rBTC-THETA",
  "rUSDC-ETH-P-THETA",
  "rUSDC-BTC-P-THETA",
] as const;
export type VaultOptions = typeof FullVaultList[number];
const ProdExcludeVault: VaultOptions[] = [
  "rUSDC-BTC-P-THETA",
  "ryvUSDC-ETH-P-THETA",
];
const PutThetaVault: VaultOptions[] = [
  "rUSDC-BTC-P-THETA",
  "rUSDC-ETH-P-THETA",
  "ryvUSDC-ETH-P-THETA",
];
// @ts-ignore
export const VaultList: VaultOptions[] = !isProduction()
  ? FullVaultList
  : FullVaultList.filter((vault) => !ProdExcludeVault.includes(vault));

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
  "ryvUSDC-ETH-P-THETA": {
    deposit: 210000,
    withdraw: 210000,
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

const getYearnETHPutThetaVaultId = () =>
  isDevelopment()
    ? deployment.kovan.RibbonYearnETHPut
    : deployment.mainnet.RibbonYearnETHPut;

export const VaultLiquidityMiningMap: Partial<
  {
    [vault in VaultOptions]: string;
  }
> = isDevelopment()
  ? {
      "rUSDC-ETH-P-THETA": deployment.kovan.RibbonETHPutStakingReward,
      "rUSDC-BTC-P-THETA": deployment.kovan.RibbonWBTCPutStakingReward,
      "rBTC-THETA": deployment.kovan.RibbonWBTCCoveredCallStakingReward,
      "rETH-THETA": deployment.kovan.RibbonETHCoveredCallStakingReward,
    }
  : {
      "rUSDC-ETH-P-THETA": deployment.mainnet.RibbonETHPutStakingReward,
      "rBTC-THETA": deployment.mainnet.RibbonWBTCCoveredCallStakingReward,
      "rETH-THETA": deployment.mainnet.RibbonETHCoveredCallStakingReward,
    };

export const isPutVault = (vault: VaultOptions): boolean =>
  PutThetaVault.includes(vault);

export const VaultAddressMap: { [vault in VaultOptions]: () => string } = {
  "rUSDC-ETH-P-THETA": getETHPutThetaVaultId,
  "rUSDC-BTC-P-THETA": getWBTCPutThetaVaultId,
  "rETH-THETA": getETHThetaVaultId,
  "rBTC-THETA": getWBTCThetaVaultId,
  "ryvUSDC-ETH-P-THETA": getYearnETHPutThetaVaultId,
};

export const VaultNamesList = [
  "T-USDC-P-ETH",
  "T-USDC-P-WBTC",
  "T-ETH-C",
  "T-WBTC-C",
  "T-yUSDC-P-ETH",
] as const;
export type VaultName = typeof VaultNamesList[number];
export const VaultNameOptionMap: { [name in VaultName]: VaultOptions } = {
  "T-USDC-P-ETH": "rUSDC-ETH-P-THETA",
  "T-USDC-P-WBTC": "rUSDC-BTC-P-THETA",
  "T-ETH-C": "rETH-THETA",
  "T-WBTC-C": "rBTC-THETA",
  "T-yUSDC-P-ETH": "ryvUSDC-ETH-P-THETA",
};

export const getEtherscanURI = () =>
  isDevelopment() ? "https://kovan.etherscan.io" : "https://etherscan.io";

export const getAssets = (vault: VaultOptions): Assets => {
  switch (vault) {
    case "rUSDC-ETH-P-THETA":
    case "rUSDC-BTC-P-THETA":
    case "ryvUSDC-ETH-P-THETA":
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
    case "ryvUSDC-ETH-P-THETA":
      return "WETH";
  }
};

export const getDisplayAssets = (vault: VaultOptions): Assets => {
  switch (vault) {
    case "rUSDC-ETH-P-THETA":
    case "rUSDC-BTC-P-THETA":
      return "USDC";
    case "rETH-THETA":
      return "WETH";
    case "rBTC-THETA":
      return "WBTC";
    case "ryvUSDC-ETH-P-THETA":
      return "yvUSDC";
  }
};

export const VaultMaxDeposit: { [vault in VaultOptions]: BigNumber } = {
  "rUSDC-BTC-P-THETA": BigNumber.from(500000).mul(
    BigNumber.from(10).pow(getAssetDecimals(getAssets("rUSDC-BTC-P-THETA")))
  ),
  "rUSDC-ETH-P-THETA": BigNumber.from(500000).mul(
    BigNumber.from(10).pow(getAssetDecimals(getAssets("rUSDC-ETH-P-THETA")))
  ),
  "rETH-THETA": BigNumber.from(250).mul(
    BigNumber.from(10).pow(getAssetDecimals(getAssets("rETH-THETA")))
  ),
  "rBTC-THETA": BigNumber.from(15).mul(
    BigNumber.from(10).pow(getAssetDecimals(getAssets("rBTC-THETA")))
  ),
  "ryvUSDC-ETH-P-THETA": BigNumber.from(500000).mul(
    BigNumber.from(10).pow(getAssetDecimals(getAssets("ryvUSDC-ETH-P-THETA")))
  ),
};

export const VaultWithdrawalFee: { [vault in VaultOptions]: string } = {
  "rUSDC-BTC-P-THETA": "0.5",
  "rUSDC-ETH-P-THETA": "2",
  "rETH-THETA": "0.5",
  "rBTC-THETA": "0.5",
  "ryvUSDC-ETH-P-THETA": "1.0",
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
    case "ryvUSDC-ETH-P-THETA":
      return "T-YUSDC-P-ETH";
  }
};

export const RibbonTokenAddress = isDevelopment()
  ? deployment.kovan.RibbonToken
  : deployment.mainnet.RibbonToken;
