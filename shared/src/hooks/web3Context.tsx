import React, { ReactElement, useContext } from "react";
import { ethers } from "ethers";
import { BaseProvider } from "@ethersproject/providers";
import { isAvaxNetwork } from "../constants/constants";
import { CHAINID, NODE_URI } from "../utils/env";

export type Web3ContextData = {
  provider: BaseProvider;
};

// TODO: Fix this in the future
// Right now we just default to ETH mainnet for the unconnected wallet state
// This means that we do not show the AVAX vault's details on the app
const defaultProvider = ethers.getDefaultProvider(NODE_URI[CHAINID.ETH_KOVAN]);
const avaxProvider = ethers.getDefaultProvider(NODE_URI[CHAINID.AVAX_FUJI]);

export const Web3Context = React.createContext<Web3ContextData>({
  provider: defaultProvider,
});
export const AvaxWeb3Context = React.createContext<Web3ContextData>({
  provider: avaxProvider,
});

export const useWeb3Context = (chainId: CHAINID = CHAINID.ETH_MAINNET) => {
  let context = Web3Context;
  if (isAvaxNetwork(chainId)) context = AvaxWeb3Context;
  return useContext(context);
};

export const Web3ContextProvider: React.FC<{ children: ReactElement }> = ({
  children,
}) => (
  <Web3Context.Provider value={{ provider: defaultProvider }}>
    {children}
  </Web3Context.Provider>
);
