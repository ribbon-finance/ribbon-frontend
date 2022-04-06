import React, { ReactElement, useContext } from "react";
import { ethers } from "ethers";
import { BaseProvider } from "@ethersproject/providers";
import { CHAINID, NODE_URI, isDevelopment } from "../utils/env";
import { isAvaxNetwork } from "../constants/constants";

export type Web3ContextData = {
  provider: BaseProvider;
};

const defaultProvider = new ethers.providers.StaticJsonRpcProvider(
  NODE_URI[isDevelopment() ? CHAINID.ETH_KOVAN : CHAINID.ETH_MAINNET]
);
const avaxProvider = new ethers.providers.StaticJsonRpcProvider(
  NODE_URI[isDevelopment() ? CHAINID.AVAX_FUJI : CHAINID.AVAX_MAINNET]
);

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

export const useETHWeb3Context = () => {
  return useContext(Web3Context);
};

export const Web3ContextProvider: React.FC<{ children: ReactElement }> = ({
  children,
}) => (
  <Web3Context.Provider value={{ provider: defaultProvider }}>
    <AvaxWeb3Context.Provider value={{ provider: avaxProvider }}>
      {children}
    </AvaxWeb3Context.Provider>
  </Web3Context.Provider>
);
