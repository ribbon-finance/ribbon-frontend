import { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import { initializeConnector } from "@web3-react/core";

export const [coinbaseWallet, hooks] = initializeConnector<CoinbaseWallet>(
  (actions) => new CoinbaseWallet({
    actions,
    options: {
      url: process.env.REACT_APP_MAINNET_RPC || "", // Coinbase only valid for mainnet
      appName: "aevo otc",
    },
  })
);
