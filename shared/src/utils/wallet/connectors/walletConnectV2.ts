import { initializeConnector } from "@web3-react/core";
import { WalletConnect as WalletConnectV2 } from "@web3-react/walletconnect-v2";

import { Chains } from "../../../constants/constants";

export const [walletConnectV2, hooks] = initializeConnector<WalletConnectV2>(
  (actions) =>
    new WalletConnectV2({
      actions,
      options: {
        projectId: process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID!,
        chains: [Chains.Ethereum],
        showQrModal: true,
        optionalMethods: ["eth_signTypedData_v4"],
      },
    })
);
