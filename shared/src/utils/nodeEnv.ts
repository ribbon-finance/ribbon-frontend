import { isDevelopment } from "./env";

enum CHAINID {
  NOT_SELECTED = -1,
  ETH_MAINNET = 1,
  ETH_KOVAN = 42,
  AVAX_FUJI = 43113,
  AVAX_MAINNET = 43114,
  BINANCE_MAINNET = 56,
}

export const NODE_URI: Record<number, string> = {
  [CHAINID.NOT_SELECTED]: process.env.REACT_APP_MAINNET_URI || "",
  [CHAINID.ETH_MAINNET]: process.env.REACT_APP_MAINNET_URI || "",
  [CHAINID.ETH_KOVAN]: process.env.REACT_APP_TESTNET_URI || "",
  [CHAINID.AVAX_MAINNET]: process.env.REACT_APP_AVAX_URI || "",
  [CHAINID.AVAX_FUJI]: process.env.REACT_APP_FUJI_URI || "",
  [CHAINID.BINANCE_MAINNET]: process.env.REACT_APP_BINANCE_URI || "",
};

export const getSolanaClusterURI: () => string = () =>
  isDevelopment()
    ? process.env.REACT_APP_SOLANA_TESTNET_URI ||
      "https://api.devnet.solana.com"
    : process.env.REACT_APP_SOLANA_MAINNET_URI ||
      "https://solana-api.projectserum.com";
