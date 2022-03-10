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
import { useVaultsSubgraphData } from "./useVaultData";

interface VaultTVLs {
  vault: { option: VaultOptions; version: VaultVersion };
  tvl: number;
}

const useTVL = () => {
  const { data, loading } = useVaultsSubgraphData();
  const { prices, loading: pricesLoading } = useAssetsPrice();

  const vaultsTVL = useMemo(() => {
    const vaultTVLs: VaultTVLs[] = [];

    VaultList.forEach((vaultOption) => {
      const asset = getAssets(vaultOption);

      // First get the v1 with non zero tvl
      const v1Vault = data.v1[vaultOption];
      if (v1Vault && !v1Vault.totalBalance.isZero()) {
        vaultTVLs.push({
          vault: {
            option: vaultOption,
            version: "v1",
          },
          tvl: parseFloat(
            assetToFiat(
              v1Vault.totalBalance,
              prices[asset],
              getAssetDecimals(asset)
            )
          ),
        });
      }

      // Then get the v2 with non zero tvl
      const v2Vault = data.v2[vaultOption];
      if (v2Vault && !v2Vault.totalBalance.isZero()) {
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
  }, [prices, data]);

  return {
    data: vaultsTVL,
    totalTVL: vaultsTVL.reduce((acc, curr) => acc + curr.tvl, 0),
    loading: loading || pricesLoading,
  };
};

export default useTVL;
