import React, { ReactElement, useContext } from "react";
import { ethers } from "ethers";
import { BaseProvider } from "@ethersproject/providers";
import { CHAINID, NODE_URI, isDevelopment } from "../utils/env";
import { isAvaxNetwork, isAuroraNetwork } from "../constants/constants";

export type Web3ContextData = {
  provider: BaseProvider;
};

// TODO: Fix this in the future
// Right now we just default to ETH mainnet for the unconnected wallet state
// This means that we do not show the AVAX vault's details on the app
const defaultProvider = ethers.getDefaultProvider(
  NODE_URI[isDevelopment() ? CHAINID.ETH_KOVAN : CHAINID.ETH_MAINNET]
);
const avaxProvider = ethers.getDefaultProvider(
  NODE_URI[isDevelopment() ? CHAINID.AVAX_FUJI : CHAINID.AVAX_MAINNET]
);
const auroraProvider = ethers.getDefaultProvider(
  NODE_URI[CHAINID.AURORA_MAINNET]
);

export const Web3Context = React.createContext<Web3ContextData>({
  provider: defaultProvider,
});

export const AvaxWeb3Context = React.createContext<Web3ContextData>({
  provider: avaxProvider,
});

export const AuroraWeb3Context = React.createContext<Web3ContextData>({
  provider: auroraProvider,
});

export const useWeb3Context = (chainId: CHAINID = CHAINID.ETH_MAINNET) => {
  let context = Web3Context;
  if (isAvaxNetwork(chainId)) context = AvaxWeb3Context;
  if (isAuroraNetwork(chainId)) context = AuroraWeb3Context;
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
      <AuroraWeb3Context.Provider value={{ provider: auroraProvider }}>
        {children}
      </AuroraWeb3Context.Provider>
    </AvaxWeb3Context.Provider>
  </Web3Context.Provider>
);
