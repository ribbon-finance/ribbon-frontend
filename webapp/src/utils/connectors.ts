import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

export const injectedConnector = new InjectedConnector({
  supportedChainIds: [1, 42],
});

export const walletConnectConnector = new WalletConnectConnector({
  rpc: { 1: process.env.REACT_APP_INFURA_URI || "" },
});

/**
 * A bug causes wallet connect connector to stuck forever upon second invoke
 * Possibly workaround as getting new connector after every connect
 * More about issue: https://github.com/NoahZinsmeister/web3-react/pull/130
 */
export const getWalletConnectConnector = () => {
  return new WalletConnectConnector({
    rpc: { 1: process.env.REACT_APP_INFURA_URI || "" },
  });
};
