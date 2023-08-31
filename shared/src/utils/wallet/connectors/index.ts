import { Web3ReactHooks } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import { Network } from "@web3-react/network";
import { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import { WalletConnect as WalletConnectV2 } from "@web3-react/walletconnect-v2";
import { AllChains, CHAINID } from "../../../constants/constants";
import { metaMask, hooks as metaMaskHooks } from "./metamask";
import { network, hooks as networkHooks } from "./network";
import {
  walletConnectV2,
  hooks as walletConnectV2Hooks,
} from "./walletConnectV2";
import { coinbaseWallet, hooks as coinbaseWalletHooks } from "./coinbaseWallet";
import { EthereumWallet, SolanaWallet, Wallet } from "../../../models/wallets";

export const supportedChainIds = [
  ...AllChains.filter((v) => v !== CHAINID.NOT_SELECTED),
];

export const allConnectors: [
  MetaMask | WalletConnectV2 | CoinbaseWallet | Network,
  Web3ReactHooks
][] = [
  [metaMask, metaMaskHooks],
  [walletConnectV2, walletConnectV2Hooks],
  [coinbaseWallet, coinbaseWalletHooks],
  [network, networkHooks],
];

export const walletToConnector: Record<
  Wallet,
  () => WalletConnectV2 | MetaMask | CoinbaseWallet | undefined
> = {
  [EthereumWallet.Metamask]: () => metaMask,
  [EthereumWallet.WalletConnect]: () => walletConnectV2,
  [EthereumWallet.WalletLink]: () => coinbaseWallet,
  [SolanaWallet.Phantom]: () => undefined,
  [SolanaWallet.Solflare]: () => undefined,
};

export const LAST_CONNECTED_WALLET_LOCAL_STORAGE_KEY = "LAST_CONNECTED_WALLET";
