import React, { ReactElement, useContext } from "react";

import { VaultOptions } from "../constants/constants";
import {
  defaultV2VaultData,
  VaultData,
  V2VaultData,
  defaultVaultData,
} from "../models/vault";
import useFetchV2VaultData from "./useFetchV2VaultData";
import useFetchVaultData from "./useFetchVaultData";

export type VaultDataContextType = {
  v1: VaultData;
  v2: V2VaultData;
};

export const VaultDataContext = React.createContext<VaultDataContextType>({
  v1: defaultVaultData,
  v2: defaultV2VaultData,
});

export const useVaultData = (vault: VaultOptions) => {
  const contextData = useContext(VaultDataContext);

  return {
    ...contextData.v1.responses[vault],
    status: contextData.v1.loading ? "loading" : "success",
  };
};

export const useV2VaultData = (vault: VaultOptions) => {
  const contextData = useContext(VaultDataContext);

  return {
    data: contextData.v2.responses[vault],
    loading: contextData.v2.loading,
  };
};

export const VaultDataContextProvider: React.FC<{ children: ReactElement }> = ({
  children,
}) => {
  const vaultData = useFetchVaultData();
  const v2VaultData = useFetchV2VaultData();

  return (
    <VaultDataContext.Provider
      value={{
        v1: vaultData,
        v2: v2VaultData,
      }}
    >
      {children}
    </VaultDataContext.Provider>
  );
};
