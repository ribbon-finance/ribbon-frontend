import React, { useState } from "react";
import { VaultOptions } from "../../constants/constants";
import { VaultAccount } from "../../models/vault";
import DesktopProductCatalogueGalleryView from "./DesktopProductCatalogueGalleryView";
import ProductCatalogueGridView from "./ProductCatalogueGridView";
import {
  DesktopViewType,
  ProductCatalogueProps,
  VaultFilterProps,
} from "./types";

interface DesktopProductCatalogueProps {
  filteredProducts: VaultOptions[];
  vaultAccounts: {
    [key: string]: VaultAccount | undefined;
  };
}

const DesktopProductCatalogue: React.FC<
  ProductCatalogueProps & VaultFilterProps & DesktopProductCatalogueProps
> = ({ dynamicMargin, ...props }) => {
  const [view, setView] = useState<DesktopViewType>("grid");

  switch (view) {
    case "grid":
      return (
        <ProductCatalogueGridView
          setView={setView}
          {...props}
          variant="desktop"
        />
      );
    case "gallery":
      return (
        <DesktopProductCatalogueGalleryView setView={setView} {...props} />
      );
  }
};

export default DesktopProductCatalogue;
