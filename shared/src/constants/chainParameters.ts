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

export const AURORA_MAINNET_PARAMS: AddEthereumChainParameter = {
  chainId: "0x4e454152",
  chainName: "Aurora Mainnet",
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: ["https://mainnet.aurora.dev"],
  blockExplorerUrls: ["https://explorer.mainnet.aurora.dev"],
};

export const AURORA_TESTNET_PARAMS: AddEthereumChainParameter = {
  chainId: "0x4E454153",
  chainName: "Aurora Testnet",
  nativeCurrency: {
    name: "Ethereum",
    symbol: "AVAX",
    decimals: 18,
  },
  rpcUrls: ["https://testnet.aurora.dev/"],
  blockExplorerUrls: ["https://explorer.testnet.aurora.dev/"],
};
