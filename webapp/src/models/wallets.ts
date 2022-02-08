export enum EthereumWallet {
  Metamask = 1,
  WalletConnect = 2,
  WalletLink = 3,
}
export const ETHEREUM_WALLETS: EthereumWallet[] = Object.values(
  EthereumWallet
).filter((v) => !isNaN(Number(v))) as EthereumWallet[];

export enum SolanaWallet {
  Phantom = 4,
  Solflare = 5,
}
export const SOLANA_WALLETS: SolanaWallet[] = Object.values(
  SolanaWallet
).filter((v) => !isNaN(Number(v))) as SolanaWallet[];

export type Wallet = EthereumWallet | SolanaWallet;

export const isEthereumWallet = (wallet: Wallet) =>
  ETHEREUM_WALLETS.includes(wallet as number);

export const isSolanaWallet = (wallet: Wallet) =>
  SOLANA_WALLETS.includes(wallet as number);

export const WALLET_TITLES = {
  [EthereumWallet.Metamask]: "METAMASK",
  [EthereumWallet.WalletConnect]: "WALLET CONNECT",
  [EthereumWallet.WalletLink]: "COINBASE WALLET",
  [SolanaWallet.Phantom]: "PHANTOM",
  [SolanaWallet.Solflare]: "SOLFLARE",
};
