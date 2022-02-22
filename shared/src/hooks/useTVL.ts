import { useMemo } from "react";

import {
  getAssets,
  VaultList,
  VaultOptions,
  VaultVersion,
} from "../constants/constants";
import { getAssetDecimals } from "../utils/asset";
import { assetToFiat } from "../utils/math";
import { useAssetsPrice } from "./useAssetPrice";
import { useV2VaultsData, useVaultsData } from "./web3DataContext";

interface VaultTVLs {
  vault: { option: VaultOptions; version: VaultVersion };
  tvl: number;
}

const useTVL = () => {
  const { data: v2VaultsData, loading: v2VaultsLoading } = useV2VaultsData();
  const { data: v1VaultsData, loading: v1VaultsLoading } = useVaultsData();

  const { prices, loading: pricesLoading } = useAssetsPrice();

  const vaultsTVL = useMemo(() => {
    const vaultTVLs: VaultTVLs[] = [];

    VaultList.forEach((vaultOption) => {
      const asset = getAssets(vaultOption);

      // First get the v1 with non zero tvl
      const v1Vault = v1VaultsData[vaultOption];
      if (!v1Vault.deposits.isZero()) {
        vaultTVLs.push({
          vault: {
            option: vaultOption,
            version: "v1",
          },
          tvl: parseFloat(
            assetToFiat(
              v1Vault.deposits,
              prices[asset],
              getAssetDecimals(asset)
            )
          ),
        });
      }

      // Then get the v2 with non zero tvl
      const v2Vault = v2VaultsData[vaultOption];
      if (!v2Vault.totalBalance.isZero()) {
        vaultTVLs.push({
          vault: {
            option: vaultOption,
            version: "v2",
          },
          tvl: parseFloat(
            assetToFiat(
              v2Vault.totalBalance,
              prices[asset],
              getAssetDecimals(asset)
            )
          ),
        });
      }
    });

    // Sort it from highest tvl to lowest
    vaultTVLs.sort((a, b) => (a.tvl < b.tvl ? 1 : -1));

    return vaultTVLs;
  }, [prices, v1VaultsData, v2VaultsData]);

  return {
    data: vaultsTVL,
    totalTVL: vaultsTVL.reduce((acc, curr) => acc + curr.tvl, 0),
    loading: v2VaultsLoading || v1VaultsLoading || pricesLoading,
  };
};

export default useTVL;
