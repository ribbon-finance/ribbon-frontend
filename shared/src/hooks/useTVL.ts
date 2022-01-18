import { useMemo } from "react";

import {
  getAssets,
  VaultList,
  VaultOptions,
  VaultVersion,
  VaultVersionList,
} from "../constants/constants";
import { getAssetDecimals } from "../utils/asset";
import { assetToFiat } from "../utils/math";
import { useAssetsPrice } from "./useAssetPrice";
import { useVaultsSubgraphData } from "./useVaultData";

const useTVL = () => {
  const { data: vaults, loading: vaultsLoading } = useVaultsSubgraphData();
  const { prices, loading: pricesLoading } = useAssetsPrice();

  const vaultsTVL = useMemo(() => {
    const vaultTVLs = VaultVersionList.flatMap((version) =>
      VaultList.map((option) => {
        const vaultData = vaults[version][option];
        const asset = getAssets(option);
        if (!vaultData) {
          return undefined;
        }

        return {
          vault: {
            option,
            version,
          },
          tvl: parseFloat(
            assetToFiat(
              vaultData.totalBalance,
              prices[asset],
              getAssetDecimals(asset)
            )
          ),
        };
      })
    ).filter((item) => item) as {
      vault: { option: VaultOptions; version: VaultVersion };
      tvl: number;
    }[];

    vaultTVLs.sort((a, b) => (a.tvl < b.tvl ? 1 : -1));

    return vaultTVLs;
  }, [prices, vaults]);

  return {
    data: vaultsTVL,
    totalTVL: vaultsTVL.reduce((acc, curr) => acc + curr.tvl, 0),
    loading: vaultsLoading || pricesLoading,
  };
};

export default useTVL;
