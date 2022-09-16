import { BigNumber } from "@ethersproject/bignumber";
import { ERC20Token } from "shared/lib/models/eth";
import { Assets } from "../store/types";
import { getAssetDecimals } from "../utils/asset";
import { CHAINID, getSubgraphqlURI } from "../utils/env";
import deployment from "./deployments.json";
import addresses from "shared/lib/constants/externalAddresses.json";
import alameda from "../assets/icons/makers/alameda.svg";
import jumptrading from "../assets/icons/makers/jumptrading.svg";
import wintermute from "../assets/icons/makers/wintermute.svg";
import orthogonal from "../assets/icons/makers/orthogonal.svg";
import folkvang from "../assets/icons/makers/folkvang.svg";

export type NETWORK_NAMES = "mainnet";
export type TESTNET_NAMES = "kovan";
export type MAINNET_NAMES = Exclude<NETWORK_NAMES, TESTNET_NAMES>;

export enum Chains {
  NotSelected,
  Ethereum,
}

export const NETWORKS: Record<number, NETWORK_NAMES> = {
  [CHAINID.ETH_MAINNET]: "mainnet",
};

export const CHAINID_TO_NATIVE_TOKENS: Record<CHAINID, Assets> = {
  [CHAINID.ETH_MAINNET]: "WETH",
};
export const READABLE_NETWORK_NAMES: Record<CHAINID, string> = {
  [CHAINID.ETH_MAINNET]: "Ethereum",
};

export const isEthNetwork = (chainId: number): boolean =>
  chainId === CHAINID.ETH_MAINNET;

export const isEthVault = (vault: string) =>
  isEthNetwork(VaultAddressMap[vault as VaultOptions].chainId);

export const getVaultChain = (vault: string): Chains => {
  if (isEthVault(vault)) return Chains.Ethereum;
  else throw new Error(`Unknown network for ${vault}`);
};

export const getVaultNetwork = (vault: string): MAINNET_NAMES => {
  if (isEthVault(vault)) return "mainnet";
  else throw new Error(`Unknown network for ${vault}`);
};

export const NATIVE_TOKENS = ["WETH"];
export const isNativeToken = (token: string): boolean =>
  NATIVE_TOKENS.includes(token);

export const VaultVersionList = ["lend"] as const;
export type VaultVersion = typeof VaultVersionList[number];

export const EVMVaultList = [
  "Alameda",
  "JumpTrading",
  "Wintermute",
  "Orthogonal",
  "Folkvang",
] as const;

const AllVaultOptions = [...EVMVaultList];

export type VaultOptions = typeof AllVaultOptions[number];

// @ts-ignore
export const VaultList: VaultOptions[] = EVMVaultList;

export const GAS_LIMITS: {
  [vault in VaultOptions]: Partial<{
    lend: { deposit: number; withdraw: number };
  }>;
} = {
  Alameda: {
    lend: {
      deposit: 80000,
      withdraw: 100000,
    },
  },
  JumpTrading: {
    lend: {
      deposit: 80000,
      withdraw: 100000,
    },
  },
  Wintermute: {
    lend: {
      deposit: 80000,
      withdraw: 100000,
    },
  },
  Orthogonal: {
    lend: {
      deposit: 80000,
      withdraw: 100000,
    },
  },
  Folkvang: {
    lend: {
      deposit: 80000,
      withdraw: 100000,
    },
  },
};

export const VaultAddressMap: {
  [vault in VaultOptions]: {
    lend: string;
    chainId: number;
  };
} = {
  Alameda: {
    lend: deployment.mainnet.Alameda,
    chainId: CHAINID.ETH_MAINNET,
  },
  JumpTrading: {
    lend: deployment.mainnet.JumpTrading,
    chainId: CHAINID.ETH_MAINNET,
  },
  Wintermute: {
    lend: deployment.mainnet.Wintermute,
    chainId: CHAINID.ETH_MAINNET,
  },
  Orthogonal: {
    lend: deployment.mainnet.Orthogonal,
    chainId: CHAINID.ETH_MAINNET,
  },
  Folkvang: {
    lend: deployment.mainnet.Folkvang,
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
  "Alameda",
  "JumpTrading",
  "Wintermute",
  "Orthogonal",
  "Folkvang",
] as const;
export type VaultName = typeof VaultNamesList[number];
export const VaultNameOptionMap: { [name in VaultName]: VaultOptions } = {
  Alameda: "Alameda",
  JumpTrading: "JumpTrading",
  Wintermute: "Wintermute",
  Orthogonal: "Orthogonal",
  Folkvang: "Folkvang",
};

// Reverse lookup for VaultNameOptionMap
export const vaultOptionToName = (option: VaultOptions) => {
  const match = Object.entries(VaultNameOptionMap).find(
    ([name, optionName]) => {
      return optionName === option;
    }
  );
  if (match) {
    return match[0] as VaultName;
  }
  return undefined;
};

export const EVM_BLOCKCHAIN_EXPLORER_NAME: Record<number, string> = {
  [CHAINID.ETH_MAINNET]: "Etherscan",
};

export const EVM_BLOCKCHAIN_EXPLORER_URI: Record<number, string> = {
  [CHAINID.ETH_MAINNET]: "https://etherscan.io",
};

export const AVAX_BRIDGE_URI = "https://bridge.avax.network";

export const getExplorerName = (chain: Chains) => {
  return EVM_BLOCKCHAIN_EXPLORER_NAME[CHAINS_TO_ID[chain]];
};

// Left here for compatibility purposes
export const getEtherscanURI = (chainId: number) =>
  EVM_BLOCKCHAIN_EXPLORER_URI[chainId as CHAINID];

export const getExplorerURI = (chain: Chains) => {
  return EVM_BLOCKCHAIN_EXPLORER_URI[CHAINS_TO_ID[chain]];
};

export const getSubgraphURIForVersion = (
  version: VaultVersion,
  chain: Chains
) => {
  return getSubgraphqlURI();
};

export const getAssets = (vault: VaultOptions): Assets => {
  return "USDC";
};

export const getDisplayAssets = (vault: VaultOptions): Assets => {
  return "USDC";
};

export const getMakerLogo = (vault: VaultOptions): string => {
  switch (vault) {
    case "Alameda":
      return alameda;
    case "JumpTrading":
      return jumptrading;
    case "Wintermute":
      return wintermute;
    case "Orthogonal":
      return orthogonal;
    case "Folkvang":
      return folkvang;
  }
};

export const VaultAllowedDepositAssets: { [vault in VaultOptions]: Assets[] } =
  {
    Alameda: ["USDC"],
    JumpTrading: ["USDC"],
    Wintermute: ["USDC"],
    Orthogonal: ["USDC"],
    Folkvang: ["USDC"],
  };

export const VaultMaxDeposit: BigNumber = BigNumber.from(100000000).mul(
  BigNumber.from(10).pow(getAssetDecimals(getAssets("Alameda")))
);

export const VaultFees = {
  managementFee: "2",
  performanceFee: "10",
};

export const RibbonTokenAddress = deployment.mainnet.RibbonToken;

export const getERC20TokenAddress = (token: ERC20Token, chainId: number) => {
  const network = NETWORKS[chainId];
  return (addresses[network].assets as any)[token];
};

export const READABLE_CHAIN_NAMES: Record<Chains, string> = {
  [Chains.Ethereum]: "Ethereum",
  [Chains.NotSelected]: "No Chain Selected",
};

export const ENABLED_CHAINS: Chains[] = [Chains.Ethereum];

export const CHAINS_TO_NATIVE_TOKENS: Record<Chains, Assets> = {
  [Chains.Ethereum]: "WETH",
  [Chains.NotSelected]: "WETH",
};

export const CHAINS_TO_ID: Record<number, number> = {
  [Chains.Ethereum]: CHAINID.ETH_MAINNET,
};

export const ID_TO_CHAINS: Record<number, number> = {
  [CHAINID.ETH_MAINNET]: Chains.Ethereum,
};

const WEBAPP_SUBGRAPHS: [VaultVersion, Chains][] = [["lend", Chains.Ethereum]];

export const SUBGRAPHS_TO_QUERY: [VaultVersion, Chains][] = WEBAPP_SUBGRAPHS;

export const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";
export const COINGECKO_CURRENCIES: { [key in Assets]: string | undefined } = {
  WETH: "ethereum",
  USDC: "usd-coin",
  RBN: "ribbon-finance",
};
