import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { isStaging } from "./env";

export const injectedConnector = new InjectedConnector({
  supportedChainIds: isStaging() ? [42] : [1],
});

/**
 * A bug causes wallet connect connector to stuck forever upon second invoke
 * Possibly workaround as getting new connector after every connect
 * More about issue: https://github.com/NoahZinsmeister/web3-react/pull/130
 */
export const getWalletConnectConnector = () => {
  return new WalletConnectConnector({
    rpc: isStaging()
      ? { 42: process.env.REACT_APP_TESTNET_URI || "" }
      : { 1: process.env.REACT_APP_MAINNET_URI || "" },
  });
};
