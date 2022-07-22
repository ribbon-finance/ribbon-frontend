import React, { useCallback, useMemo, useState } from "react";
import {
  getAssets,
  getDisplayAssets,
  hasVaultVersion,
  isPutVault,
  VaultList,
  VaultAddressMap,
  VaultOptions,
  VaultVersion,
  VaultVersionList,
  Chains,
} from "../../constants/constants";
import sizes from "../../designSystem/sizes";
import { useLatestAPYs } from "../../hooks/useLatestAPY";
import useScreenSize from "../../hooks/useScreenSize";
import useVaultAccounts from "../../hooks/useVaultAccounts";
import { useVaultsData } from "../../hooks/web3DataContext";
import { Assets } from "../../store/types";
import DesktopProductCatalogue from "./DesktopProductCatalogue";
import MobileProductCatalogue from "./MobileProductCatalogue";
import {
  ProductCatalogueProps,
  UserSelectedVaultsVersion,
  VaultReleaseOrder,
  VaultsDisplayVersion,
  VaultSortBy,
  VaultSortByList,
  VaultStrategy,
} from "./types";
import useWeb3Wallet from "../../hooks/useWeb3Wallet";
import { getChainByVaultOption, getIntegralAsset } from "../../utils/asset";
import { useChain } from "../../hooks/chainContext";

const ProductCatalogue: React.FC<ProductCatalogueProps> = ({
  variant,
  onVaultPress,
}) => {
  const [chain] = useChain();
  const { chainId } = useWeb3Wallet();
  const { width } = useScreenSize();
  const [filterStrategies, setFilterStrategies] = useState<VaultStrategy[]>([]);
  const [filterAssets, setFilterAssets] = useState<Assets[]>([]);
  const [sort, setSort] = useState<VaultSortBy>(VaultSortByList[0]);
  const yieldsData = useLatestAPYs();
  const { data: v1VaultsData, loading: v1VaultsDataLoading } = useVaultsData();
  const { vaultAccounts } = useVaultAccounts("all");
  const [userSelectedVaultsVersion, setUserSelectedVaultsVersion] =
    useState<UserSelectedVaultsVersion>({});

  const vaultsDisplayVersion = useMemo(
    (): VaultsDisplayVersion =>
      Object.fromEntries(
        VaultList.map((vaultOption) => {
          // User had selected their desired version
          if (userSelectedVaultsVersion[vaultOption]) {
            return [vaultOption, userSelectedVaultsVersion[vaultOption]];
          }

          const availableVaultVersions = VaultVersionList.filter((version) =>
            hasVaultVersion(vaultOption, version)
          );

          // If vault only has one available version
          if (availableVaultVersions.length === 1) {
            return [vaultOption, availableVaultVersions[0]];
          }

          for (let i = 0; i < availableVaultVersions.length; i++) {
            switch (availableVaultVersions[i]) {
              case "v1":
                /**
                 * We check for V1 vault if it had been disabled
                 * If we are still loading data and default vault version is v1,
                 * then we proceed to show v1
                 * It it had been disabled, we show other available vault version instead
                 */
                if (
                  v1VaultsDataLoading ||
                  !v1VaultsData[vaultOption].vaultLimit.isZero()
                ) {
                  return [vaultOption, "v1"];
                }
                break;
              case "v2":
                return [vaultOption, "v2"];
            }
          }

          return [vaultOption, VaultVersionList[0]];
        })
      ) as VaultsDisplayVersion,
    [userSelectedVaultsVersion, v1VaultsData, v1VaultsDataLoading]
  );

  const setVaultDisplayVersion = useCallback(
    (vaultOption: VaultOptions, vaultVersion: VaultVersion) => {
      setUserSelectedVaultsVersion((userSelectedVaultsVersion) => ({
        ...userSelectedVaultsVersion,
        [vaultOption]: vaultVersion,
      }));
    },
    []
  );

  const filteredProducts = useMemo(() => {
    const filteredList = VaultList.filter((vault) => {
      if (
        chain !== Chains.NotSelected &&
        (getChainByVaultOption(vault) !== chain ||
          (chainId && VaultAddressMap[vault].chainId !== chainId))
      ) {
        return false;
      }

      // Filter for strategies
      if (
        filterStrategies.length &&
        !filterStrategies.includes(
          isPutVault(vault) ? "PUT-SELLING" : "COVERED-CALL"
        )
      ) {
        return false;
      }

      // Filter for assets
      const asset = getAssets(vault);
      if (
        filterAssets.length &&
        !filterAssets.includes(asset) &&
        !filterAssets.includes(getDisplayAssets(vault)) &&
        !filterAssets.includes(getIntegralAsset(asset))
      ) {
        return false;
      }

      return true;
    });

    switch (sort) {
      case "NEWEST FIRST":
        filteredList.sort((a, b) =>
          VaultReleaseOrder.indexOf(a) < VaultReleaseOrder.indexOf(b) ? 1 : -1
        );
        break;
      case "OLDEST FIRST":
        filteredList.sort((a, b) =>
          VaultReleaseOrder.indexOf(a) > VaultReleaseOrder.indexOf(b) ? 1 : -1
        );
        break;
      case "YIELD: HIGH TO LOW":
        filteredList.sort((a, b) =>
          yieldsData.res[vaultsDisplayVersion[a]][a] <
          yieldsData.res[vaultsDisplayVersion[b]][b]
            ? 1
            : -1
        );
        break;
      case "YIELD: LOW TO HIGH":
        filteredList.sort((a, b) =>
          yieldsData.res[vaultsDisplayVersion[a]][a] >
          yieldsData.res[vaultsDisplayVersion[b]][b]
            ? 1
            : -1
        );
        break;
    }

    return filteredList;
  }, [
    chain,
    chainId,
    filterAssets,
    filterStrategies,
    sort,
    vaultsDisplayVersion,
    yieldsData,
  ]);

  return width > sizes.md ? (
    <DesktopProductCatalogue
      variant={variant}
      onVaultPress={onVaultPress}
      filterStrategies={filterStrategies}
      filterAssets={filterAssets}
      sort={sort}
      setFilterStrategies={setFilterStrategies}
      setFilterAssets={setFilterAssets}
      setSort={setSort}
      filteredProducts={filteredProducts}
      vaultAccounts={vaultAccounts}
      vaultsDisplayVersion={vaultsDisplayVersion}
      setVaultDisplayVersion={setVaultDisplayVersion}
    />
  ) : (
    <MobileProductCatalogue
      variant={variant}
      onVaultPress={onVaultPress}
      filterStrategies={filterStrategies}
      filterAssets={filterAssets}
      sort={sort}
      setFilterStrategies={setFilterStrategies}
      setFilterAssets={setFilterAssets}
      setSort={setSort}
      filteredProducts={filteredProducts}
      vaultAccounts={vaultAccounts}
      vaultsDisplayVersion={vaultsDisplayVersion}
      setVaultDisplayVersion={setVaultDisplayVersion}
    />
  );
};

export default ProductCatalogue;
