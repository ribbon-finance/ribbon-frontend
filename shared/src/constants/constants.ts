import { BigNumber } from "@ethersproject/bignumber";
import { ERC20Token } from "../models/eth";
import { Assets } from "../store/types";
import { getAssetDecimals } from "../utils/asset";
import {
  getSubgraphqlURI,
  getV2SubgraphURI,
  isDevelopment,
  isProduction,
} from "../utils/env";
import v1deployment from "./v1Deployments.json";
import v2deployment from "./v2Deployments.json";
import addresses from "./externalAddresses.json";

export const NETWORK_NAMES: Record<number, string> = {
  1: "mainnet",
  42: "kovan",
};

export const VaultVersionList = ["v2", "v1"] as const;
export type VaultVersion = typeof VaultVersionList[number];

export const FullVaultList = [
  "rAAVE-THETA",
  "rstETH-THETA",
  "ryvUSDC-ETH-P-THETA",
  "rETH-THETA",
  "rBTC-THETA",
  "rUSDC-ETH-P-THETA",
] as const;
export type VaultOptions = typeof FullVaultList[number];
const ProdExcludeVault: VaultOptions[] = ["rstETH-THETA"];
const PutThetaVault: VaultOptions[] = [
  "rUSDC-ETH-P-THETA",
  "ryvUSDC-ETH-P-THETA",
];
// @ts-ignore
export const VaultList: VaultOptions[] = !isProduction()
  ? FullVaultList
  : FullVaultList.filter((vault) => !ProdExcludeVault.includes(vault));

export const GAS_LIMITS: {
  [vault in VaultOptions]: Partial<{
    v1: { deposit: number; withdraw: number };
    v2: {
      deposit: number;
      withdrawInstantly: number;
    };
  }>;
} = {
  "rETH-THETA": {
    v1: {
      deposit: 80000,
      withdraw: 100000,
    },
    v2: {
      deposit: 120000,
      withdrawInstantly: 120000,
    },
  },
  "rBTC-THETA": {
    v1: {
      deposit: 100000,
      withdraw: 140000,
    },
    v2: {
      deposit: 140000,
      withdrawInstantly: 120000,
    },
  },
  "rUSDC-ETH-P-THETA": {
    v1: {
      deposit: 120000,
      withdraw: 120000,
    },
    v2: {
      deposit: 140000,
      withdrawInstantly: 120000,
    },
  },
  "ryvUSDC-ETH-P-THETA": {
    v1: {
      deposit: 210000,
      withdraw: 210000,
    },
  },
  "rstETH-THETA": {
    v2: {
      deposit: 170000,
      withdrawInstantly: 130000,
    },
  },
  "rAAVE-THETA": {
    v2: {
      deposit: 380000,
      withdrawInstantly: 130000,
    },
  },
};

export const VaultLiquidityMiningMap: Partial<
  {
    [vault in VaultOptions]: string;
  }
> = isDevelopment()
  ? {
      "rUSDC-ETH-P-THETA": v1deployment.kovan.RibbonETHPutStakingReward,
      "rBTC-THETA": v1deployment.kovan.RibbonWBTCCoveredCallStakingReward,
      "rETH-THETA": v1deployment.kovan.RibbonETHCoveredCallStakingReward,
    }
  : {
      "rUSDC-ETH-P-THETA": v1deployment.mainnet.RibbonETHPutStakingReward,
      "rBTC-THETA": v1deployment.mainnet.RibbonWBTCCoveredCallStakingReward,
      "rETH-THETA": v1deployment.mainnet.RibbonETHCoveredCallStakingReward,
    };

export const isPutVault = (vault: VaultOptions): boolean =>
  PutThetaVault.includes(vault);

export const VaultAddressMap: {
  [vault in VaultOptions]: Partial<
    {
      [version in VaultVersion]: string;
    }
  >;
} = {
  "rUSDC-ETH-P-THETA": isDevelopment()
    ? {
        v1: v1deployment.kovan.RibbonETHPut,
      }
    : {
        v1: v1deployment.mainnet.RibbonETHPut,
      },
  "rETH-THETA": isDevelopment()
    ? {
        v1: v1deployment.kovan.RibbonETHCoveredCall,
        v2: v2deployment.kovan.RibbonThetaVaultETHCall,
      }
    : {
        v1: v1deployment.mainnet.RibbonETHCoveredCall,
        v2: v2deployment.mainnet.RibbonThetaVaultETHCall,
      },
  "rBTC-THETA": isDevelopment()
    ? {
        v1: v1deployment.kovan.RibbonWBTCCoveredCall,
        v2: v2deployment.kovan.RibbonThetaVaultWBTCCall,
      }
    : {
        v1: v1deployment.mainnet.RibbonWBTCCoveredCall,
        v2: v2deployment.mainnet.RibbonThetaVaultWBTCCall,
      },
  "ryvUSDC-ETH-P-THETA": isDevelopment()
    ? {
        v1: v1deployment.kovan.RibbonYearnETHPut,
      }
    : {
        v1: v1deployment.mainnet.RibbonYearnETHPut,
      },
  "rstETH-THETA": isDevelopment()
    ? {
        // TODO: Replace kovan address
        v2: v2deployment.kovan.RibbonThetaVaultETHCall,
      }
    : {
        // TODO: Add stETH vault mainnet address
      },
  "rAAVE-THETA": isDevelopment()
    ? {
        // TODO: Replace kovan address
        v2: v2deployment.kovan.RibbonThetaVaultETHCall,
      }
    : {
        v2: v2deployment.mainnet.RibbonThetaVaultAAVECall,
      },
};

/**
 * Used to check if vault of given version exists. Only used for v2 and above
 * @param vaultOption
 * @returns boolean
 */
export const hasVaultVersion = (
  vaultOption: VaultOptions,
  version: VaultVersion
): boolean => {
  return Boolean(VaultAddressMap[vaultOption][version]);
};

export const VaultNamesList = [
  "T-USDC-P-ETH",
  "T-ETH-C",
  "T-WBTC-C",
  "T-yvUSDC-P-ETH",
  "T-stETH-C",
  "T-AAVE-C",
] as const;
export type VaultName = typeof VaultNamesList[number];
export const VaultNameOptionMap: { [name in VaultName]: VaultOptions } = {
  "T-USDC-P-ETH": "rUSDC-ETH-P-THETA",
  "T-ETH-C": "rETH-THETA",
  "T-WBTC-C": "rBTC-THETA",
  "T-yvUSDC-P-ETH": "ryvUSDC-ETH-P-THETA",
  "T-stETH-C": "rstETH-THETA",
  "T-AAVE-C": "rAAVE-THETA",
};

export const getEtherscanURI = () =>
  isDevelopment() ? "https://kovan.etherscan.io" : "https://etherscan.io";

export const getSubgraphURIForVersion = (vaultVersion: VaultVersion) => {
  switch (vaultVersion) {
    case "v1":
      return getSubgraphqlURI();
    case "v2":
      return getV2SubgraphURI();
  }
};

export const getAssets = (vault: VaultOptions): Assets => {
  switch (vault) {
    case "rUSDC-ETH-P-THETA":
    case "ryvUSDC-ETH-P-THETA":
      return "USDC";
    case "rETH-THETA":
    case "rstETH-THETA":
      return "WETH";
    case "rBTC-THETA":
      return "WBTC";
    case "rAAVE-THETA":
      return "AAVE";
  }
};

export const getOptionAssets = (vault: VaultOptions): Assets => {
  switch (vault) {
    case "rBTC-THETA":
      return "WBTC";
    case "rETH-THETA":
    case "rUSDC-ETH-P-THETA":
    case "ryvUSDC-ETH-P-THETA":
    case "rstETH-THETA":
      return "WETH";
    case "rAAVE-THETA":
      return "AAVE";
  }
};

export const getDisplayAssets = (vault: VaultOptions): Assets => {
  switch (vault) {
    case "rUSDC-ETH-P-THETA":
      return "USDC";
    case "rETH-THETA":
      return "WETH";
    case "rBTC-THETA":
      return "WBTC";
    case "ryvUSDC-ETH-P-THETA":
      return "yvUSDC";
    case "rstETH-THETA":
      return "stETH";
    case "rAAVE-THETA":
      return "AAVE";
  }
};

export const VaultMaxDeposit: { [vault in VaultOptions]: BigNumber } = {
  "rUSDC-ETH-P-THETA": BigNumber.from(100000000).mul(
    BigNumber.from(10).pow(getAssetDecimals(getAssets("rUSDC-ETH-P-THETA")))
  ),
  "rETH-THETA": BigNumber.from(50000).mul(
    BigNumber.from(10).pow(getAssetDecimals(getAssets("rETH-THETA")))
  ),
  "rBTC-THETA": BigNumber.from(2000).mul(
    BigNumber.from(10).pow(getAssetDecimals(getAssets("rBTC-THETA")))
  ),
  "ryvUSDC-ETH-P-THETA": BigNumber.from(100000000).mul(
    BigNumber.from(10).pow(getAssetDecimals(getAssets("ryvUSDC-ETH-P-THETA")))
  ),
  // TODO: Confirm max deposit for stETH vault
  "rstETH-THETA": BigNumber.from(50000).mul(
    BigNumber.from(10).pow(getAssetDecimals(getAssets("rstETH-THETA")))
  ),
  "rAAVE-THETA": BigNumber.from(3100).mul(
    BigNumber.from(10).pow(getAssetDecimals(getAssets("rAAVE-THETA")))
  ),
};

export const VaultFees: {
  [vault in VaultOptions]: Partial<{
    v1: { withdrawalFee: string };
    v2: { managementFee: string; performanceFee: string };
  }>;
} = {
  "rUSDC-ETH-P-THETA": {
    v1: {
      withdrawalFee: "1.0",
    },
  },
  "rETH-THETA": {
    v1: {
      withdrawalFee: "0.5",
    },
    v2: {
      managementFee: "2",
      performanceFee: "10",
    },
  },
  "rBTC-THETA": {
    v1: {
      withdrawalFee: "0.5",
    },
    v2: {
      managementFee: "2",
      performanceFee: "10",
    },
  },
  "ryvUSDC-ETH-P-THETA": {
    v1: {
      withdrawalFee: "1.0",
    },
  },
  "rstETH-THETA": {
    v2: {
      managementFee: "2",
      performanceFee: "10",
    },
  },
  "rAAVE-THETA": {
    v2: {
      managementFee: "2",
      performanceFee: "10",
    },
  },
};

export const RibbonTokenAddress = isDevelopment()
  ? v1deployment.kovan.RibbonToken
  : v1deployment.mainnet.RibbonToken;

export const RibbonTokenBalancerPoolAddress = isDevelopment()
  ? v1deployment.kovan.RibbonTokenBalancerPool
  : // TODO: Update Mainnet Address
    "";

export const getERC20TokenAddress = (token: ERC20Token) =>
  isDevelopment()
    ? addresses.kovan.assets[token]
    : addresses.mainnet.assets[token];
