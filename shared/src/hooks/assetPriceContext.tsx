import React, { ReactElement } from "react";

import { Assets, AssetsList } from "../store/types";
import { useFetchAssetsPrice } from "./useAssetPrice";

export type AssetPriceResponses = {
  [asset in Assets]: { price: number; timestamp: number }[];
};

export type AssetPriceContextData = {
  responses: AssetPriceResponses;
  loading: boolean;
};

export const defaultAssetPriceContextData = {
  responses: Object.fromEntries(
    AssetsList.map((asset) => [
      asset,
      [] as { price: number; timestamp: number }[],
    ])
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
