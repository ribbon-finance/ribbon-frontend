import { Provider } from "@ethersproject/providers";
import { ethers } from "ethers";
import React, { ReactElement, useContext } from "react";
import { getNodeURI } from "../utils/env";

export type Web3ContextData = {
  provider: Provider;
};

const defaultProvider = ethers.getDefaultProvider(getNodeURI());

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
