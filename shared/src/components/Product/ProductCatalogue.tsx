import React, { useMemo, useState } from "react";
import { VaultList } from "../../constants/constants";

import sizes from "../../designSystem/sizes";
import { useLatestAPYs } from "../../hooks/useAirtableData";
import useScreenSize from "../../hooks/useScreenSize";
import { Assets } from "../../store/types";
import DesktopProductCatalogue from "./DesktopProductCatalogue";
import {
  ProductCatalogueProps,
  VaultReleaseOrder,
  VaultSortBy,
  VaultSortByList,
  VaultStrategy,
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

  const filteredProducts = useMemo(() => {
    const filteredList = [...VaultList];

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
  }, [sort, yieldsData]);

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
    />
  ) : (
    <></>
  );
};

export default ProductCatalogue;
