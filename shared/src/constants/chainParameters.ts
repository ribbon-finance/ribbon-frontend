import { Chains } from "./constants";

interface AddEthereumChainParameter {
  chainId: string; // A 0x-prefixed hexadecimal string
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string; // 2-6 characters long
    decimals: 18;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[]; // Currently ignored.
}

export const BINANCE_MAINNET_PARAMS: AddEthereumChainParameter = {
  chainId: "0x38",
  chainName: "Binance Mainnet C-Chain",
  nativeCurrency: {
    name: "Binance",
    symbol: "BNB",
    decimals: 18,
  },
  rpcUrls: ["https://bsc-dataseed.binance.org"],
  blockExplorerUrls: ["https://bscscan.com"],
};

export const AVALANCHE_MAINNET_PARAMS: AddEthereumChainParameter = {
  chainId: "0xA86A",
  chainName: "Avalanche Mainnet C-Chain",
  nativeCurrency: {
    name: "Avalanche",
    symbol: "AVAX",
    decimals: 18,
  },
  rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
  blockExplorerUrls: ["https://snowtrace.io/"],
};

export const AVALANCHE_TESTNET_PARAMS: AddEthereumChainParameter = {
  chainId: "0xA869",
  chainName: "Avalanche Fuji C-Chain",
  nativeCurrency: {
    name: "Avalanche",
    symbol: "AVAX",
    decimals: 18,
  },
  rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
  blockExplorerUrls: ["https://testnet.snowtrace.io/"],
};

type ChainIdToChainParam = {
  [chainId in Chains] : AddEthereumChainParameter | undefined;
};

export const CHAIN_PARAMS: ChainIdToChainParam = {
  [Chains.NotSelected]: undefined,
  [Chains.Ethereum]: undefined,
  [Chains.Avalanche]: AVALANCHE_MAINNET_PARAMS,
  [Chains.Binance]: BINANCE_MAINNET_PARAMS,
  [Chains.Solana]: undefined
};