import React, { ReactElement, useContext } from "react";
import { ethers } from "ethers";
import { BaseProvider } from "@ethersproject/providers";
import { CHAINID, NODE_URI } from "../utils/env";

export type Web3ContextData = {
  provider: BaseProvider;
};

const defaultProvider = new ethers.providers.StaticJsonRpcProvider(
  NODE_URI[CHAINID.ETH_MAINNET]
);

export const Web3Context = React.createContext<Web3ContextData>({
  provider: defaultProvider,
});

export const useWeb3Context = (chainId: CHAINID = CHAINID.ETH_MAINNET) => {
  let context = Web3Context;
  return useContext(context);
};

export const useETHWeb3Context = () => {
  return useContext(Web3Context);
};

export const Web3ContextProvider: React.FC<{ children: ReactElement }> = ({
  children,
}) => (
  <Web3Context.Provider value={{ provider: defaultProvider }}>
    {children}
  </Web3Context.Provider>
);
