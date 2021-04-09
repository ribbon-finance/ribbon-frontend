import { Provider } from "@ethersproject/providers";
import { ethers } from "ethers";
import React, { ReactElement, useContext } from "react";

export type Web3ContextData = {
  provider: Provider;
};

const provider = ethers.getDefaultProvider(process.env.REACT_APP_MAINNET_URI);

export const Web3Context = React.createContext<Web3ContextData>({
  provider: provider,
});

export const useWeb3Context = () => useContext(Web3Context);

export const Web3ContextProvider: React.FC<{ children: ReactElement }> = ({
  children,
}) => {
  return (
    <Web3Context.Provider value={{ provider }}>{children}</Web3Context.Provider>
  );
};
