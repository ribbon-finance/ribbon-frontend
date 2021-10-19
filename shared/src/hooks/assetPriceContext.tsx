import React, { ReactElement } from "react";

import { Assets, AssetsList } from "../store/types";
import { useFetchAssetsPrice } from "./useAssetPrice";

export type AssetPriceResponses = {
  [asset in Assets]: {
    latestPrice: number;
    history: { [timestamp: number]: number };
  };
};

export type AssetPriceContextData = {
  responses: AssetPriceResponses;
  loading: boolean;
};

export const defaultAssetPriceContextData = {
  responses: Object.fromEntries(
    AssetsList.map((asset) => [asset, { latestPrice: 0, history: {} }])
  ) as AssetPriceResponses,
  loading: true,
};

export const AssetPriceContext = React.createContext<AssetPriceContextData>(
  defaultAssetPriceContextData
);

export const AssetPriceContextProvider: React.FC<{ children: ReactElement }> =
  ({ children }) => {
    const assetsPrice = useFetchAssetsPrice();

    return (
      <AssetPriceContext.Provider value={assetsPrice}>
        {children}
      </AssetPriceContext.Provider>
    );
  };
