import React, { ReactElement } from "react";

import { Assets, AssetsList } from "../store/types";
import { useFetchAssetsPrice } from "./useAssetPrice";
import { useFetchYearnAPIData } from "./useYearnAPIData";
import { useTickerData } from "./useTickerData";

export type AssetsPriceData = {
  [asset in Assets]: {
    loading: boolean;
    latestPrice: number;
    history: { [timestamp: number]: number };
  };
};

export type AssetsTickerData = {
  [asset in Assets]: {
    asset: string;
    price: number;
    dailyChange: number;
  };
};

export type YearnAPIData = Array<{
  address: string;
  symbol: string;
  name: string;
  token: {
    address: string;
    decimals: number;
    name: string;
    symbol: string;
  };
  type: string;
  version: string;
  apy: {
    grossAPR: number;
    netAPY: number;
  };
}>;

export type ExternalAPIDataContextType = {
  assetsPrice: { data: AssetsPriceData };
  yearnAPIData: { data: YearnAPIData; loading: boolean };
  tickerData: { data: AssetsTickerData; loading: boolean };
};

export const defaultAssetsPriceData = Object.fromEntries(
  AssetsList.map((asset) => [
    asset,
    {
      loading: true,
      latestPrice: 0,
      history: {},
    },
  ])
) as AssetsPriceData;

export const defaultAssetTickerData = Object.fromEntries(
  AssetsList.map((asset) => [
    asset,
    {
      asset,
      price: 0,
      dailyChange: 0,
    },
  ])
) as AssetsTickerData;

export const defaultExternalAPIData: ExternalAPIDataContextType = {
  assetsPrice: { data: defaultAssetsPriceData },
  yearnAPIData: { data: [], loading: true },
  tickerData: { data: defaultAssetTickerData, loading: true },
};

export const ExternalAPIDataContext =
  React.createContext<ExternalAPIDataContextType>(defaultExternalAPIData);

export const ExternalAPIDataContextProvider: React.FC<{
  children: ReactElement;
}> = ({ children }) => {
  const assetsPrice = useFetchAssetsPrice();
  const yearnAPIData = useFetchYearnAPIData();
  const tickerData = useTickerData();

  return (
    <ExternalAPIDataContext.Provider
      value={{
        assetsPrice,
        yearnAPIData,
        tickerData,
      }}
    >
      {children}
    </ExternalAPIDataContext.Provider>
  );
};
