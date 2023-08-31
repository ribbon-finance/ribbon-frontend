import React, { ReactElement, useContext } from "react";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { NODE_URI, isDevelopment } from "../utils/env";
import { CHAINID, isAvaxNetwork, isBinanceNetwork } from "../constants/constants";
export type Web3ContextData = {
  provider: StaticJsonRpcProvider;
};

const defaultProvider = new StaticJsonRpcProvider(
  NODE_URI[isDevelopment() ? CHAINID.ETH_KOVAN : CHAINID.ETH_MAINNET]
);
const avaxProvider = new StaticJsonRpcProvider(
  NODE_URI[isDevelopment() ? CHAINID.AVAX_FUJI : CHAINID.AVAX_MAINNET]
);
const binanceProvider = new StaticJsonRpcProvider(
  NODE_URI[CHAINID.BINANCE_MAINNET]
);

export const Web3Context = React.createContext<Web3ContextData>({
  provider: defaultProvider,
});

export const AvaxWeb3Context = React.createContext<Web3ContextData>({
  provider: avaxProvider,
});

export const BinanceWeb3Context = React.createContext<Web3ContextData>({
  provider: binanceProvider,
});

export const useWeb3Context = (chainId: CHAINID = CHAINID.ETH_MAINNET) => {
  let context = Web3Context;
  if (isAvaxNetwork(chainId)) context = AvaxWeb3Context;
  if (isBinanceNetwork(chainId)) context = BinanceWeb3Context;
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
      <BinanceWeb3Context.Provider value={{ provider: binanceProvider }}>
        {children}
      </BinanceWeb3Context.Provider>
    </AvaxWeb3Context.Provider>
  </Web3Context.Provider>
);
