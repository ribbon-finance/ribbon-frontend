import React, { ReactElement, useContext } from "react";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { NODE_URI, isDevelopment } from "shared/lib/utils/env";
import { CHAINID } from "shared/lib/constants/constants";
export type Web3ContextData = {
  provider: StaticJsonRpcProvider;
};

const defaultProvider = new StaticJsonRpcProvider(
  NODE_URI[isDevelopment() ? CHAINID.ETH_KOVAN : CHAINID.ETH_MAINNET]
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
