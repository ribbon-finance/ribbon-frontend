import React, { ReactElement } from "react";

import { Assets, AssetsList } from "../store/types";
import { useFetchAssetsPrice } from "./useAssetPrice";

export type AssetsPriceData = {
  [asset in Assets]: {
    loading: boolean;
    latestPrice: number;
    dailyChange: number;
  };
};

export type AssetsHistoricalPriceData = {
  [asset in Assets]: {
    loading: boolean;
    history: { [timestamp: number]: number };
  };
};

export type ExternalAPIDataContextType = {
  assetsPrice: { data: AssetsPriceData };
  assetsHistoricalPrice: { data: AssetsHistoricalPriceData };
};

export const defaultAssetsPriceData = Object.fromEntries(
  AssetsList.map((asset) => [
    asset,
    {
      loading: true,
      latestPrice: 0,
      dailyChange: 0,
    },
  ])
) as AssetsPriceData;

export const defaultAssetsHistoricalPriceData = Object.fromEntries(
  AssetsList.map((asset) => [
    asset,
    {
      loading: true,
      history: {},
    },
  ])
) as AssetsHistoricalPriceData;

export const defaultExternalAPIData: ExternalAPIDataContextType = {
  assetsPrice: { data: defaultAssetsPriceData },
  assetsHistoricalPrice: { data: defaultAssetsHistoricalPriceData },
};

export const ExternalAPIDataContext =
  React.createContext<ExternalAPIDataContextType>(defaultExternalAPIData);

export const ExternalAPIDataContextProvider: React.FC<{
  children: ReactElement;
}> = ({ children }) => {
  const { assetsPrice, assetsHistoricalPrice } = useFetchAssetsPrice();
  return (
    <ExternalAPIDataContext.Provider
      value={{
        assetsPrice,
        assetsHistoricalPrice,
      }}
    >
      {children}
    </ExternalAPIDataContext.Provider>
  );
};
