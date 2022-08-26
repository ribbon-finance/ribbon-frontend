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
  vault: {
    option: VaultOptions;
    version: VaultVersion;
  };
  tvl: number;
  loading: boolean;
}

const useTVL = () => {
  const { data, loading } = useVaultsSubgraphData();
  const { prices } = useAssetsPrice();

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
              prices[asset].price,
              getAssetDecimals(asset)
            )
          ),
          loading: loading || prices[asset].loading,
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
              prices[asset].price,
              getAssetDecimals(asset)
            )
          ),
          loading: loading || prices[asset].loading,
        });
      }

      // REARN
      const earnVault = data.earn[vaultOption];
      if (earnVault && !earnVault.totalBalance.isZero()) {
        vaultTVLs.push({
          vault: {
            option: vaultOption,
            version: "earn",
          },
          tvl: parseFloat(
            assetToFiat(
              earnVault.totalBalance,
              prices[asset].price,
              getAssetDecimals(asset)
            )
          ),
          loading: loading || prices[asset].loading,
        });
      }
    });

    // Sort it from highest tvl to lowest
    vaultTVLs.sort((a, b) => (a.tvl < b.tvl ? 1 : -1));
    return vaultTVLs;
  }, [data.v1, data.v2, data.earn, prices, loading]);

  return {
    data: vaultsTVL,
    totalTVL: vaultsTVL.reduce((acc, curr) => acc + curr.tvl, 0),
    loading,
  };
};

export default useTVL;
