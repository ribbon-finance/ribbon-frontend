import React, { ReactElement } from "react";

import {
  DefiScoreProtocol,
  DefiScoreToken,
  DefiScoreTokenList,
} from "../models/defiScore";
import { Assets, AssetsList } from "../store/types";
import { useFetchAssetsPrice } from "./useAssetPrice";
import { useFetchAssetsYield } from "./useAssetsYield";
import { useFetchYearnAPIData } from "./useYearnAPIData";

export type AssetsPriceData = {
  [asset in Assets]: {
    latestPrice: number;
    history: { [timestamp: number]: number };
  };
};

export type AssetYieldInfo = Array<{
  protocol: DefiScoreProtocol;
  apr: number;
}>;

export type AssetsYieldInfoData = {
  [token in DefiScoreToken]: AssetYieldInfo;
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
  assetsPrice: { data: AssetsPriceData; loading: boolean };
  assetsYield: { data: AssetsYieldInfoData; loading: boolean };
  yearnAPIData: { data: YearnAPIData; loading: boolean };
};

export const defaultAssetsPriceData = Object.fromEntries(
  AssetsList.map((asset) => [asset, { latestPrice: 0, history: {} }])
) as AssetsPriceData;

export const defaultAssetsYieldData = Object.fromEntries(
  DefiScoreTokenList.map((token) => [token, new Array(0)])
) as {
  [token in DefiScoreToken]: Array<{
    protocol: DefiScoreProtocol;
    apr: number;
  }>;
};

export const defaultExternalAPIData: ExternalAPIDataContextType = {
  assetsPrice: { data: defaultAssetsPriceData, loading: true },
  assetsYield: { data: defaultAssetsYieldData, loading: true },
  yearnAPIData: { data: [], loading: true },
};

export const ExternalAPIDataContext =
  React.createContext<ExternalAPIDataContextType>(defaultExternalAPIData);

export const ExternalAPIDataContextProvider: React.FC<{
  children: ReactElement;
}> = ({ children }) => {
  const assetsPrice = useFetchAssetsPrice();
  const assetsYield = useFetchAssetsYield();
  const yearnAPIData = useFetchYearnAPIData();

  return (
    <ExternalAPIDataContext.Provider
      value={{
        assetsPrice,
        assetsYield,
        yearnAPIData,
      }}
    >
      {children}
    </ExternalAPIDataContext.Provider>
  );
};
