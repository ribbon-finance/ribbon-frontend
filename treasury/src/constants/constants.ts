import { BigNumber } from "@ethersproject/bignumber";
import { ERC20Token } from "../models/eth";
import { Assets } from "../store/types";
import { getAssetDecimals } from "../utils/asset";
import {
  getSubgraphqlURI,
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
  "rPERP-TSRY",
] as const;

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
    v2: {
      deposit: 120000,
      withdrawInstantly: 120000,
      completeWithdraw: 300000,
    },
  },
  "rPERP-TSRY": {
    v2: {
      deposit: 120000,
      withdrawInstantly: 120000,
      completeWithdraw: 300000,
    },
  },
};

export const VaultAddressMap: {
  [vault in VaultOptions]: {
    v1?: string;
    v2?: string;
    chainId: number;
  }
} = {
  "rBZRX-TSRY": isDevelopment()
    ? {
        v2: v2deployment.kovan.RibbonTreasuryVaultBZRX,
        chainId: CHAINID.ETH_KOVAN,
      }
    : {
        v2: v2deployment.mainnet.RibbonThetaVaultETHCall,
        chainId: CHAINID.ETH_MAINNET,
      },
  "rPERP-TSRY": isDevelopment()
    ? {
        v2: v2deployment.kovan.RibbonTreasuryVaultPERP,
        chainId: CHAINID.ETH_KOVAN,
      }
    : {
        v2: v2deployment.mainnet.RibbonThetaVaultETHCall,
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
  "T-BZRX-C",
  "T-PERP-C",
] as const;
export type VaultName = typeof VaultNamesList[number];
export const VaultNameOptionMap: { [name in VaultName]: VaultOptions } = {
  "T-BZRX-C": "rBZRX-TSRY",
  "T-PERP-C": "rPERP-TSRY",
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

export const getAssets = (vault: VaultOptions): Assets => {
  switch (vault) {
    case "rBZRX-TSRY":
      return "BZRX";
    case "rPERP-TSRY":
      return "PERP";
  }
};

export const getOptionAssets = (vault: VaultOptions): Assets => {
  switch (vault) {
    case "rBZRX-TSRY":
      return "BZRX"
    case "rPERP-TSRY":
      return "PERP"
  }
};

export const getDisplayAssets = (vault: VaultOptions): Assets => {
  switch (vault) {
    case "rBZRX-TSRY":
      return "BZRX";
    case "rPERP-TSRY":
      return "PERP";
  }
};

export const VaultAllowedDepositAssets: { [vault in VaultOptions]: Assets[] } =
  {
    "rBZRX-TSRY": ["BZRX"],
    "rPERP-TSRY": ["PERP"],
  };

export const VaultMaxDeposit: { [vault in VaultOptions]: BigNumber } = {
  "rBZRX-TSRY": BigNumber.from(1000).mul(
    BigNumber.from(10).pow(getAssetDecimals(getAssets("rBZRX-TSRY")))
  ),
  "rPERP-TSRY": BigNumber.from(1000).mul(
    BigNumber.from(10).pow(getAssetDecimals(getAssets("rPERP-TSRY")))
  ),
};

export const VaultFees: {
  [vault in VaultOptions]: Partial<{
    v1: { withdrawalFee: string };
    v2: { managementFee: string; performanceFee: string };
  }>;
} = {
  "rBZRX-TSRY": {
    v2: {
      managementFee: "2",
      performanceFee: "10",
    },
  },
  "rPERP-TSRY": {
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
