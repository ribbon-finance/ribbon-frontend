import { Provider } from "@ethersproject/providers";
import { ethers } from "ethers";
import React, { ReactElement, useContext, useEffect, useState } from "react";

export type Web3ContextData = {
  provider: Provider | undefined;
};

export const Web3Context = React.createContext<Web3ContextData>({
  provider: undefined,
});

export const useWeb3Context = () => useContext(Web3Context);

export const Web3ContextProvider: React.FC<{ children: ReactElement }> = ({
  children,
}) => {
  const [provider, setProvider] = useState<Provider | undefined>(undefined);

  useEffect(() => {
    const provider = ethers.getDefaultProvider(
      process.env.REACT_APP_MAINNET_URI
    );
    setProvider(provider);
  }, []);

  return (
    <Web3Context.Provider value={{ provider }}>{children}</Web3Context.Provider>
  );
};
