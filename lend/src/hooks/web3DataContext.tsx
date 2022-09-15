import React, { ReactElement, useContext } from "react";

import {
  getAssets,
  getDisplayAssets,
  VaultOptions,
} from "../constants/constants";
import { VaultData, defaultVaultData } from "../models/vault";
import { getAssetDecimals } from "../utils/asset";
import useFetchVaultData from "./useFetchVaultData";
import useFetchAssetBalanceData, {
  defaultUserAssetBalanceData,
  UserAssetBalanceData,
} from "./useFetchAssetBalanceData";

export type Web3DataContextType = {
  lend: VaultData;
  assetBalance: UserAssetBalanceData;
};

export const Web3DataContext = React.createContext<Web3DataContextType>({
  lend: defaultVaultData,
  assetBalance: defaultUserAssetBalanceData,
});

export const useVaultsData = () => {
  const contextData = useContext(Web3DataContext);

  return {
    data: contextData.lend.responses,
    loading: contextData.lend.loading,
  };
};

export const useVaultData = (vault: VaultOptions) => {
  const contextData = useContext(Web3DataContext);

  return {
    ...contextData.lend.responses[vault],
    asset: getAssets(vault),
    displayAsset: getDisplayAssets(vault),
    decimals: getAssetDecimals(getAssets(vault)),
    userAssetBalance: contextData.assetBalance.data[getAssets(vault)],
    status:
      contextData.lend.loading || contextData.assetBalance.loading
        ? "loading"
        : "success",
  };
};

export const useAssetsBalance = () => {
  const contextData = useContext(Web3DataContext);

  return contextData.assetBalance;
};

export const Web3DataContextProvider: React.FC<{ children: ReactElement }> = ({
  children,
}) => {
  const vaultData = useFetchVaultData();
  const assetBalance = useFetchAssetBalanceData();

  return (
    <Web3DataContext.Provider
      value={{
        lend: vaultData,
        assetBalance: assetBalance,
      }}
    >
      {children}
    </Web3DataContext.Provider>
  );
};
