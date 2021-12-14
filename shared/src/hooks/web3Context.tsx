import React, { ReactElement, useContext } from "react";
import { ethers } from "ethers";
import { BaseProvider } from "@ethersproject/providers";
import { NODE_URI } from "../utils/env";

export type Web3ContextData = {
  provider: BaseProvider;
};

const defaultProvider = ethers.getDefaultProvider(NODE_URI[parseInt(
  (window as any)?.ethereum?.chainId
)]);

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
