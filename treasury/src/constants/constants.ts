import { BigNumber } from "@ethersproject/bignumber";
import { ERC20Token } from "shared/lib/models/eth";
import { Assets } from "../store/types";
import { getAssetDecimals } from "../utils/asset";
import {
  getSubgraphqlURI,
  getV2SubgraphURI,
  isDevelopment,
  isProduction,
} from "shared/lib/utils/env";
import v1deployment from "./v1Deployments.json";
import v2deployment from "./v2Deployments.json";
import addresses from "./externalAddresses.json";

export enum CHAINID {
  ETH_MAINNET = 1,
  ETH_KOVAN = 42,
  AVAX_FUJI = 43113,
  AVAX_MAINNET = 43114,
}

export type NETWORK_NAMES  = "mainnet" | "kovan" | "fuji" | "avax";
export const NETWORKS: Record<number, NETWORK_NAMES> = {
  [CHAINID.ETH_MAINNET]: "mainnet",
  [CHAINID.ETH_KOVAN]: "kovan",
  [CHAINID.AVAX_FUJI]: "fuji",
  [CHAINID.AVAX_MAINNET]: "avax",
};

export const isEthNetwork = (chainId: number): boolean =>
  chainId === CHAINID.ETH_MAINNET || chainId === CHAINID.ETH_KOVAN

export const NATIVE_TOKENS = ['WETH', 'WAVAX'];
export const isNativeToken = (token: string): boolean => NATIVE_TOKENS.includes(token)

export const VaultVersionList = ["v2", "v1"] as const;
export type VaultVersion = typeof VaultVersionList[number];

export const FullVaultList = [
  "rBZRX-TSRY",
  "rBTC-THETA",
  "rUSDC-ETH-P-THETA"
] as const;
const PutThetaVault: VaultOptions[] = [
  "rUSDC-ETH-P-THETA",
];

export type VaultOptions = typeof FullVaultList[number];

// @ts-ignore
export const VaultList: VaultOptions[] = FullVaultList;

export const GAS_LIMITS: {
  [vault in VaultOptions]: Partial<{
    v1: { deposit: number; withdraw: number };
    v2: {
      deposit: number;
      withdrawInstantly: number;
      completeWithdraw: number;
    };
  }>;
} = {
  "rBZRX-TSRY": {
    v1: {
      deposit: 80000,
      withdraw: 100000,
    },
    v2: {
      deposit: 120000,
      withdrawInstantly: 120000,
      completeWithdraw: 300000,
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
      completeWithdraw: 300000,
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
      completeWithdraw: 300000,
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
      "rBZRX-TSRY": v1deployment.kovan.RibbonETHCoveredCallStakingReward,
    }
  : {
      "rUSDC-ETH-P-THETA": v1deployment.mainnet.RibbonETHPutStakingReward,
      "rBTC-THETA": v1deployment.mainnet.RibbonWBTCCoveredCallStakingReward,
      "rBZRX-TSRY": v1deployment.mainnet.RibbonETHCoveredCallStakingReward,
    };

export const isPutVault = (vault: VaultOptions): boolean =>
  PutThetaVault.includes(vault);

export const VaultAddressMap: {
  [vault in VaultOptions]: {
    v1?: string;
    v2?: string;
    chainId: number;
  }
} = {
  "rUSDC-ETH-P-THETA": isDevelopment()
    ? {
        v1: v1deployment.kovan.RibbonETHPut,
        chainId: CHAINID.ETH_KOVAN,
      }
    : {
        v1: v1deployment.mainnet.RibbonETHPut,
        chainId: CHAINID.ETH_MAINNET,
      },
  "rBZRX-TSRY": isDevelopment()
    ? {
        v1: v1deployment.kovan.RibbonETHCoveredCall,
        v2: v2deployment.kovan.RibbonThetaVaultETHCall,
        chainId: CHAINID.ETH_KOVAN,
      }
    : {
        v1: v1deployment.mainnet.RibbonETHCoveredCall,
        v2: v2deployment.mainnet.RibbonThetaVaultETHCall,
        chainId: CHAINID.ETH_MAINNET,
      },
  "rBTC-THETA": isDevelopment()
    ? {
        v1: v1deployment.kovan.RibbonWBTCCoveredCall,
        v2: v2deployment.kovan.RibbonThetaVaultWBTCCall,
        chainId: CHAINID.ETH_KOVAN,
      }
    : {
        v1: v1deployment.mainnet.RibbonWBTCCoveredCall,
        v2: v2deployment.mainnet.RibbonThetaVaultWBTCCall,
        chainId: CHAINID.ETH_MAINNET,
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
  "T-BZRX-C",
  "T-WBTC-C",
] as const;
export type VaultName = typeof VaultNamesList[number];
export const VaultNameOptionMap: { [name in VaultName]: VaultOptions } = {
  "T-USDC-P-ETH": "rUSDC-ETH-P-THETA",
  "T-BZRX-C": "rBZRX-TSRY",
  "T-WBTC-C": "rBTC-THETA",
};

export const BLOCKCHAIN_EXPLORER_NAME: Record<number, string> = {
  [CHAINID.ETH_MAINNET]: 'Etherscan',
  [CHAINID.ETH_KOVAN]: 'Etherscan',
  [CHAINID.AVAX_MAINNET]: 'SnowTrace',
  [CHAINID.AVAX_FUJI]: 'SnowTrace',
}

export const BLOCKCHAIN_EXPLORER_URI: Record<number, string> = {
  [CHAINID.ETH_MAINNET]: "https://etherscan.io",
  [CHAINID.ETH_KOVAN]: "https://kovan.etherscan.io",
  [CHAINID.AVAX_MAINNET]: "https://snowtrace.io",
  [CHAINID.AVAX_FUJI]: "https://testnet.snowtrace.io",
}

export const getEtherscanURI = (chainId: number) => BLOCKCHAIN_EXPLORER_URI[chainId as CHAINID]

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
    case "rBZRX-TSRY":
    case "rBTC-THETA":
      return "WBTC";
  }
};

export const getOptionAssets = (vault: VaultOptions): Assets => {
  switch (vault) {
    case "rBTC-THETA":
      return "WBTC";
    case "rBZRX-TSRY":
    case "rUSDC-ETH-P-THETA":
      return "WETH";
  }
};

export const getDisplayAssets = (vault: VaultOptions): Assets => {
  switch (vault) {
    case "rUSDC-ETH-P-THETA":
      return "USDC";
    case "rBZRX-TSRY":
      return "WETH";
    case "rBTC-THETA":
      return "WBTC";
  }
};

export const VaultAllowedDepositAssets: { [vault in VaultOptions]: Assets[] } =
  {
    "rBTC-THETA": ["WBTC"],
    "rBZRX-TSRY": ["WETH"],
    "rUSDC-ETH-P-THETA": ["USDC"],
  };

export const VaultMaxDeposit: { [vault in VaultOptions]: BigNumber } = {
  "rUSDC-ETH-P-THETA": BigNumber.from(100000000).mul(
    BigNumber.from(10).pow(getAssetDecimals(getAssets("rUSDC-ETH-P-THETA")))
  ),
  "rBZRX-TSRY": BigNumber.from(50000).mul(
    BigNumber.from(10).pow(getAssetDecimals(getAssets("rBZRX-TSRY")))
  ),
  "rBTC-THETA": BigNumber.from(2000).mul(
    BigNumber.from(10).pow(getAssetDecimals(getAssets("rBTC-THETA")))
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
  "rBZRX-TSRY": {
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
};

export const RibbonTokenAddress = isDevelopment()
  ? v1deployment.kovan.RibbonToken
  : v1deployment.mainnet.RibbonToken;

export const RibbonTokenBalancerPoolAddress = isDevelopment()
  ? v1deployment.kovan.RibbonTokenBalancerPool
  : // TODO: Update Mainnet Address
    "";

export const getERC20TokenAddress = (token: ERC20Token, chainId: number) => {
  const network = NETWORKS[chainId];
  return isDevelopment()
    ? (addresses[network].assets as any)[token]
    : (addresses[network].assets as any)[token];
}

export const LidoCurvePoolAddress = isDevelopment()
  ? ""
  : addresses.mainnet.lidoCurvePool;

export const CurveSwapSlippage = 0.008; // 0.8%

export const getVaultURI = (
  vaultOption: VaultOptions,
  vaultVersion: VaultVersion = "v1"
): string => {
  return `/treasury/${
    Object.keys(VaultNameOptionMap)[
      Object.values(VaultNameOptionMap).indexOf(vaultOption)
    ]
  }`;
};
