import React, { ReactElement, useContext, useState } from "react";
import { Chains } from "../constants/constants";

interface ChainContextType {
  chain: Chains;
  setChain: (chain: Chains) => void;
}

const ChainContext = React.createContext<ChainContextType>({
  chain: Chains.NotSelected,
  setChain: () => {},
});

export const useChain: () => [Chains, (chain: Chains) => void] = () => {
  const { chain, setChain } = useContext(ChainContext);
  return [chain, setChain];
};

export const ChainContextProvider: React.FC<{
  children: ReactElement;
}> = ({ children }) => {
  const [chain, setChain] = useState(Chains.Ethereum);

  return (
    <ChainContext.Provider value={{ chain, setChain }}>
      {children}
    </ChainContext.Provider>
  );
};
