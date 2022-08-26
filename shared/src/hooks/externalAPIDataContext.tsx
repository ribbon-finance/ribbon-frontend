import React, { ReactElement } from "react";

import { Assets, AssetsList } from "../store/types";
import { useFetchAssetsPrice } from "./useAssetPrice";

export type AssetsPriceData = {
  [asset in Assets]: {
    loading: boolean;
    latestPrice: number;
    dailyChange: number;
    history: { [timestamp: number]: number };
  };
};

export type ExternalAPIDataContextType = {
  assetsPrice: { data: AssetsPriceData };
};

export const defaultAssetsPriceData = Object.fromEntries(
  AssetsList.map((asset) => [
    asset,
    {
      loading: true,
      latestPrice: 0,
      dailyChange: 0,
      history: {},
    },
  ])
) as AssetsPriceData;

export const defaultExternalAPIData: ExternalAPIDataContextType = {
  assetsPrice: { data: defaultAssetsPriceData },
};

export const ExternalAPIDataContext =
  React.createContext<ExternalAPIDataContextType>(defaultExternalAPIData);

export const ExternalAPIDataContextProvider: React.FC<{
  children: ReactElement;
}> = ({ children }) => {
  const assetsPrice = useFetchAssetsPrice();

  return (
    <ExternalAPIDataContext.Provider
      value={{
        assetsPrice,
      }}
    >
      {children}
    </ExternalAPIDataContext.Provider>
  );
};
