import { initializeConnector } from "@web3-react/core";
import { Network } from "@web3-react/network";

import { CHAINID, Chains } from "../../../constants/constants"
import { CHAIN_PARAMS } from "../../../constants/chainParameters";

const allRpcUrls = {
  ...Object.keys(CHAIN_PARAMS).reduce(
    (prev, key) => ({
      ...prev,
      [key]:
        CHAIN_PARAMS[Number(key) as keyof typeof CHAIN_PARAMS]?.rpcUrls || "",
    }),
    {}
  ),
  [CHAINID.ETH_MAINNET]: process.env.REACT_APP_MAINNET_RPC || "",
};

export const [network, hooks] = initializeConnector<Network>(
  (actions) => new Network({ actions, urlMap: allRpcUrls })
);
