import { useWeb3React } from "@web3-react/core";
import React, { ReactElement, useContext, useEffect, useState } from "react";
import { CHAINID } from "shared/lib/utils/env";

export enum Chains {
  NotSelected,
  Ethereum,
  Avalanche,
  Solana,
}

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
  const { chainId: ethChainId } = useWeb3React();

  // `chain` is a completely different state from the chainId set by the wallet
  // so we need to refresh it
  useEffect(() => {
    switch (ethChainId) {
      case CHAINID.ETH_KOVAN:
      case CHAINID.ETH_MAINNET:
        setChain(Chains.Ethereum);
        break;
      case CHAINID.AVAX_FUJI:
      case CHAINID.AVAX_MAINNET:
        setChain(Chains.Avalanche);
        break;
      default:
        break;
    }
  }, [ethChainId, setChain]);

  return [chain, setChain];
};

export const ChainContextProvider: React.FC<{
  children: ReactElement;
}> = ({ children }) => {
  const [chain, setChain] = useState(Chains.NotSelected);

  return (
    <ChainContext.Provider value={{ chain, setChain }}>
      {children}
    </ChainContext.Provider>
  );
};
