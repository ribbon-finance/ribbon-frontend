import React, { useMemo, useState } from "react";
import { getAssets, VaultList } from "../../constants/constants";

import sizes from "../../designSystem/sizes";
import { useLatestAPYs } from "../../hooks/useAirtableData";
import useScreenSize from "../../hooks/useScreenSize";
import useVaultAccounts from "../../hooks/useVaultAccounts";
import { Assets } from "../../store/types";
import DesktopProductCatalogue from "./DesktopProductCatalogue";
import MobileProductCatalogue from "./MobileProductCatalogue";
import {
  ProductCatalogueProps,
  VaultReleaseOrder,
  VaultSortBy,
  VaultSortByList,
  VaultStrategy,
  VaultStrategyMap,
} from "./types";

const ProductCatalogue: React.FC<ProductCatalogueProps> = ({
  dynamicMargin,
  onVaultPress,
}) => {
  const { width } = useScreenSize();
  const [filterStrategies, setFilterStrategies] = useState<VaultStrategy[]>([]);
  const [filterAssets, setFilterAssets] = useState<Assets[]>([]);
  const [sort, setSort] = useState<VaultSortBy>(VaultSortByList[0]);
  const yieldsData = useLatestAPYs(VaultList);
  const { vaultAccounts } = useVaultAccounts(VaultList);

  const filteredProducts = useMemo(() => {
    const filteredList = VaultList.filter((vault) => {
      // Filter for strategies
      if (
        filterStrategies.length &&
        !filterStrategies.includes(VaultStrategyMap[vault])
      ) {
        return false;
      }

      // Filter for assets
      if (filterAssets.length && !filterAssets.includes(getAssets(vault))) {
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
          yieldsData[a].res < yieldsData[b].res ? 1 : -1
        );
        break;
      case "YIELD: LOW TO HIGH":
        filteredList.sort((a, b) =>
          yieldsData[a].res > yieldsData[b].res ? 1 : -1
        );
        break;
    }

    return filteredList;
  }, [filterAssets, filterStrategies, sort, yieldsData]);

  return width > sizes.md ? (
    <DesktopProductCatalogue
      dynamicMargin={dynamicMargin}
      onVaultPress={onVaultPress}
      filterStrategies={filterStrategies}
      filterAssets={filterAssets}
      sort={sort}
      setFilterStrategies={setFilterStrategies}
      setFilterAssets={setFilterAssets}
      setSort={setSort}
      filteredProducts={filteredProducts}
      vaultAccounts={vaultAccounts}
    />
  ) : (
    <MobileProductCatalogue
      dynamicMargin={dynamicMargin}
      onVaultPress={onVaultPress}
      filterStrategies={filterStrategies}
      filterAssets={filterAssets}
      sort={sort}
      setFilterStrategies={setFilterStrategies}
      setFilterAssets={setFilterAssets}
      setSort={setSort}
      filteredProducts={filteredProducts}
      vaultAccounts={vaultAccounts}
    />
  );
};

export default ProductCatalogue;
