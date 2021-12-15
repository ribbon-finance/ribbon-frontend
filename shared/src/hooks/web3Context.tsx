import React, { ReactElement, useContext } from "react";
import { ethers } from "ethers";
import { BaseProvider } from "@ethersproject/providers";
import { CHAINID, NODE_URI } from "../utils/env";

export type Web3ContextData = {
  provider: BaseProvider;
};

// TODO: Fix this in the future
// Right now we just default to ETH mainnet for the unconnected wallet state
// This means that we do not show the AVAX vault's details on the app
const defaultProvider = ethers.getDefaultProvider(
  NODE_URI[CHAINID.ETH_MAINNET]
);

export const Web3Context = React.createContext<Web3ContextData>({
  provider: defaultProvider,
});

export const useWeb3Context = () => useContext(Web3Context);

export const Web3ContextProvider: React.FC<{ children: ReactElement }> = ({
  children,
}) => (
  <Web3Context.Provider value={{ provider: defaultProvider }}>
    {children}
  </Web3Context.Provider>
);
