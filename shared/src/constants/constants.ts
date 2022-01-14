import { BigNumber } from "@ethersproject/bignumber";
import { ERC20Token } from "../models/eth";
import { Assets } from "../store/types";
import { getAssetDecimals } from "../utils/asset";
import {
  CHAINID,
  SUBGRAPH_URI,
  getSubgraphqlURI,
  isDevelopment,
  isProduction,
  isTreasury,
} from "../utils/env";
import v1deployment from "./v1Deployments.json";
import v2deployment from "./v2Deployments.json";
import addresses from "./externalAddresses.json";

export type NETWORK_NAMES = "mainnet" | "kovan" | "fuji" | "avax";
export const NETWORKS: Record<number, NETWORK_NAMES> = {
  [CHAINID.ETH_MAINNET]: "mainnet",
  [CHAINID.ETH_KOVAN]: "kovan",
  [CHAINID.AVAX_FUJI]: "fuji",
  [CHAINID.AVAX_MAINNET]: "avax",
};

export const CHAINID_TO_NATIVE_TOKENS: Record<CHAINID, Assets> = {
  [CHAINID.ETH_MAINNET]: "WETH",
  [CHAINID.ETH_KOVAN]: "WETH",
  [CHAINID.AVAX_MAINNET]: "WAVAX",
  [CHAINID.AVAX_FUJI]: "WAVAX",
};
export const READABLE_NETWORK_NAMES: Record<CHAINID, string> = {
  [CHAINID.ETH_MAINNET]: "Ethereum",
  [CHAINID.ETH_KOVAN]: "Kovan",
  [CHAINID.AVAX_MAINNET]: "Avalanche",
  [CHAINID.AVAX_FUJI]: "Fuji",
};

export const isEthNetwork = (chainId: number): boolean =>
  chainId === CHAINID.ETH_MAINNET || chainId === CHAINID.ETH_KOVAN;

export const isAvaxNetwork = (chainId: number): boolean =>
  chainId === CHAINID.AVAX_MAINNET || chainId === CHAINID.AVAX_FUJI;

export const isEthVault = (vault: string) =>
  isEthNetwork(VaultAddressMap[vault as VaultOptions].chainId);

export const isAvaxVault = (vault: string) =>
  isAvaxNetwork(VaultAddressMap[vault as VaultOptions].chainId);

export const NATIVE_TOKENS = ["WETH", "WAVAX"];
export const isNativeToken = (token: string): boolean =>
  NATIVE_TOKENS.includes(token);

export const VaultVersionList = ["v2", "v1"] as const;
export type VaultVersion = typeof VaultVersionList[number];
export type VaultVersionExcludeV1 = Exclude<VaultVersion, "v1">;

export const RetailVaultList = [
  "rAAVE-THETA",
  "rAVAX-THETA",
  "rstETH-THETA",
  "ryvUSDC-ETH-P-THETA",
  "rETH-THETA",
  "rBTC-THETA",
  "rUSDC-ETH-P-THETA",
  "rSOL-THETA",
] as const;

export const TreasuryVaultList = ["rPERP-TSRY"] as const;

const AllVaultOptions = [...RetailVaultList, ...TreasuryVaultList];

export type VaultOptions = typeof AllVaultOptions[number];
const ProdExcludeVault: VaultOptions[] = [];
const PutThetaVault: VaultOptions[] = [
  "rUSDC-ETH-P-THETA",
  "ryvUSDC-ETH-P-THETA",
];

// @ts-ignore
export const VaultList: VaultOptions[] = isTreasury()
  ? TreasuryVaultList
  : !isProduction()
  ? RetailVaultList
  : RetailVaultList.filter((vault) => !ProdExcludeVault.includes(vault));

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
  "rETH-THETA": {
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
  "ryvUSDC-ETH-P-THETA": {
    v1: {
      deposit: 210000,
      withdraw: 210000,
    },
    v2: {
      deposit: 140000,
      withdrawInstantly: 120000,
      completeWithdraw: 300000,
    },
  },
  "rstETH-THETA": {
    v2: {
      deposit: 170000,
      withdrawInstantly: 130000,
      completeWithdraw: 400000,
    },
  },
  "rAAVE-THETA": {
    v2: {
      deposit: 380000,
      withdrawInstantly: 130000,
      completeWithdraw: 300000,
    },
  },
  "rAVAX-THETA": {
    v2: {
      deposit: 380000,
      withdrawInstantly: 130000,
      completeWithdraw: 300000,
    },
  },
  "rPERP-TSRY": {
    v2: {
      deposit: 380000,
      withdrawInstantly: 130000,
      completeWithdraw: 300000,
    },
  },
  "rSOL-THETA": {
    v2: {
      deposit: 380000,
      withdrawInstantly: 130000,
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
  [vault in VaultOptions]: {
    v1?: string;
    v2?: string;
    chainId: number;
  };
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
  "rETH-THETA": isDevelopment()
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
  "ryvUSDC-ETH-P-THETA": isDevelopment()
    ? {
        v1: v1deployment.kovan.RibbonYearnETHPut,
        chainId: CHAINID.ETH_KOVAN,
      }
    : {
        v1: v1deployment.mainnet.RibbonYearnETHPut,
        v2: v2deployment.mainnet.RibbonThetaYearnVaultETHPut,
        chainId: CHAINID.ETH_MAINNET,
      },
  "rstETH-THETA": isDevelopment()
    ? {
        /**
         * We use ETH vault for Kovan preview
         */
        v2: v2deployment.kovan.RibbonThetaVaultETHCall,
        chainId: CHAINID.ETH_KOVAN,
      }
    : {
        v2: v2deployment.mainnet.RibbonThetaVaultSTETHCall,
        chainId: CHAINID.ETH_MAINNET,
      },
  "rAAVE-THETA": isDevelopment()
    ? {
        /**
         * We use ETH vault for Kovan preview
         */
        v2: v2deployment.kovan.RibbonThetaVaultETHCall,
        chainId: CHAINID.ETH_KOVAN,
      }
    : {
        v2: v2deployment.mainnet.RibbonThetaVaultAAVECall,
        chainId: CHAINID.ETH_MAINNET,
      },
  "rAVAX-THETA": isDevelopment()
    ? {
        v2: v2deployment.fuji.RibbonThetaVaultETHCall,
        chainId: CHAINID.AVAX_FUJI,
      }
    : {
        v2: v2deployment.avax.RibbonThetaVaultETHCall,
        chainId: CHAINID.AVAX_MAINNET,
      },
  "rPERP-TSRY": isDevelopment()
    ? {
        v2: v2deployment.kovan.RibbonTreasuryVaultPERP,
        chainId: CHAINID.ETH_KOVAN,
      }
    : {
        v2: v2deployment.mainnet.RibbonTreasuryVaultPERP,
        chainId: CHAINID.ETH_MAINNET,
      },
  // FIXME: change with real addresses
  "rSOL-THETA": isDevelopment()
    ? {
        v2: v2deployment.kovan.RibbonTreasuryVaultPERP,
        chainId: CHAINID.ETH_KOVAN,
      }
    : {
        v2: v2deployment.mainnet.RibbonTreasuryVaultPERP,
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
  version: VaultVersion,
  chainId: number
): boolean => {
  return (
    Boolean(VaultAddressMap[vaultOption][version]) &&
    VaultAddressMap[vaultOption].chainId === chainId
  );
};

export const VaultNamesList = [
  "T-USDC-P-ETH",
  "T-ETH-C",
  "T-WBTC-C",
  "T-yvUSDC-P-ETH",
  "T-stETH-C",
  "T-AAVE-C",
  "T-AVAX-C",
  "T-PERP-C",
  "T-SOL-C",
] as const;
export type VaultName = typeof VaultNamesList[number];
export const VaultNameOptionMap: { [name in VaultName]: VaultOptions } = {
  "T-USDC-P-ETH": "rUSDC-ETH-P-THETA",
  "T-ETH-C": "rETH-THETA",
  "T-WBTC-C": "rBTC-THETA",
  "T-yvUSDC-P-ETH": "ryvUSDC-ETH-P-THETA",
  "T-stETH-C": "rstETH-THETA",
  "T-AAVE-C": "rAAVE-THETA",
  "T-AVAX-C": "rAVAX-THETA",
  "T-PERP-C": "rPERP-TSRY",
  "T-SOL-C": "rSOL-THETA",
};

export const BLOCKCHAIN_EXPLORER_NAME: Record<number, string> = {
  [CHAINID.ETH_MAINNET]: "Etherscan",
  [CHAINID.ETH_KOVAN]: "Etherscan",
  [CHAINID.AVAX_MAINNET]: "SnowTrace",
  [CHAINID.AVAX_FUJI]: "SnowTrace",
};

export const BLOCKCHAIN_EXPLORER_URI: Record<number, string> = {
  [CHAINID.ETH_MAINNET]: "https://etherscan.io",
  [CHAINID.ETH_KOVAN]: "https://kovan.etherscan.io",
  [CHAINID.AVAX_MAINNET]: "https://snowtrace.io",
  [CHAINID.AVAX_FUJI]: "https://testnet.snowtrace.io",
};

export const AVAX_BRIDGE_URI = "https://bridge.avax.network";

export const getEtherscanURI = (chainId: number) =>
  BLOCKCHAIN_EXPLORER_URI[chainId as CHAINID];

export const getSubgraphURIForVersion = (
  vaultVersion: VaultVersion,
  chainId: number
) => {
  switch (vaultVersion) {
    case "v1":
      return getSubgraphqlURI();
    case "v2":
      return SUBGRAPH_URI[chainId];
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
    case "rAVAX-THETA":
      return "WAVAX";
    case "rPERP-TSRY":
      return "PERP";
    case "rSOL-THETA":
      return "SOL";
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
    case "rAVAX-THETA":
      return "WAVAX";
    case "rPERP-TSRY":
      return "PERP";
    case "rSOL-THETA":
      return "SOL";
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
    case "rAVAX-THETA":
      return "WAVAX";
    case "rPERP-TSRY":
      return "PERP";
    case "rSOL-THETA":
      return "SOL";
  }
};

export const VaultAllowedDepositAssets: { [vault in VaultOptions]: Assets[] } =
  {
    "rAAVE-THETA": ["AAVE"],
    "rBTC-THETA": ["WBTC"],
    "rETH-THETA": ["WETH"],
    "rAVAX-THETA": ["WAVAX"],
    "rUSDC-ETH-P-THETA": ["USDC"],
    "rstETH-THETA": ["stETH", "WETH"],
    "ryvUSDC-ETH-P-THETA": ["USDC"],
    "rPERP-TSRY": ["PERP"],
    "rSOL-THETA": ["SOL"],
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
  "rAVAX-THETA": BigNumber.from(100000000).mul(
    BigNumber.from(10).pow(getAssetDecimals(getAssets("rAVAX-THETA")))
  ),
  "rPERP-TSRY": BigNumber.from(100000000).mul(
    // Cap still not decided
    BigNumber.from(10).pow(getAssetDecimals(getAssets("rPERP-TSRY")))
  ),
  // FIXME: change with real numbers
  "rSOL-THETA": BigNumber.from(100000000).mul(
    BigNumber.from(10).pow(getAssetDecimals(getAssets("rAVAX-THETA")))
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
    v2: {
      managementFee: "2",
      performanceFee: "10",
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
  "rAVAX-THETA": {
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
  // FIXME: Change with real values
  "rSOL-THETA": {
    v2: {
      managementFee: "2",
      performanceFee: "10",
    },
  },
};

export const RibbonVaultMigrationMap: Partial<
  {
    [vault in VaultOptions]: Partial<
      { [version in VaultVersionExcludeV1]: Array<VaultOptions> }
    >;
  }
> = {
  "rBTC-THETA": {
    v2: ["rBTC-THETA"],
  },
  // TODO: Once we enable migrations into stETH vault
  // We can uncomment this
  // "rstETH-THETA": {
  //   v2: ["rETH-THETA"],
  // },
  "rETH-THETA": {
    v2: ["rETH-THETA"],
  },
  "ryvUSDC-ETH-P-THETA": {
    v2: ["ryvUSDC-ETH-P-THETA", "rUSDC-ETH-P-THETA"],
  },
};

export const v1ToV2MigrationMap: Partial<
  { [vault in VaultOptions]: VaultOptions }
> = {
  "rBTC-THETA": "rBTC-THETA",
  "rETH-THETA": "rETH-THETA",
  // TODO: Uncomment this
  // "rETH-THETA": "rstETH-THETA",
  "rUSDC-ETH-P-THETA": "ryvUSDC-ETH-P-THETA",
  "ryvUSDC-ETH-P-THETA": "ryvUSDC-ETH-P-THETA",
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
};

export const LidoCurvePoolAddress = isDevelopment()
  ? ""
  : addresses.mainnet.lidoCurvePool;

export const CurveSwapSlippage = 0.008; // 0.8%

export const LidoOracleAddress = isDevelopment()
  ? ""
  : addresses.mainnet.lidoOracle;

export const SUBGRAPHS_TO_QUERY: [VaultVersion, CHAINID][] = isDevelopment()
  ? [
      ["v1", CHAINID.ETH_KOVAN],
      ["v2", CHAINID.ETH_KOVAN],
      ["v2", CHAINID.AVAX_FUJI],
    ]
  : [
      ["v1", CHAINID.ETH_MAINNET],
      ["v2", CHAINID.ETH_MAINNET],
      ["v2", CHAINID.AVAX_MAINNET],
    ];
