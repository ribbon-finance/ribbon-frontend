import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import LedgerHQFrameConnector from "web3-ledgerhq-frame-connector";
import { supportedChainIds } from "./env";

export const injectedConnector = new InjectedConnector({
  supportedChainIds,
});

// Only receive messages from platform.apps.ledger.com
export const ledgerConnector = new LedgerHQFrameConnector();

export const walletlinkConnector = new WalletLinkConnector({
  url: process.env.REACT_APP_MAINNET_URI!,
  appName: "Ribbon Lend",
  supportedChainIds,
});
