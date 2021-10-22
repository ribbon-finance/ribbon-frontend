import React from "react";
import { VaultOptions } from "../../constants/constants";
import { VaultAccount } from "../../models/vault";
import ProductCatalogueGridView from "./ProductCatalogueGridView";
import {
  ProductCatalogueProps,
  VaultFilterProps,
  VaultsDisplayVersionProps,
} from "./types";

interface DesktopProductCatalogueProps {
  filteredProducts: VaultOptions[];
  vaultAccounts: {
    [key: string]: VaultAccount | undefined;
  };
}

const MobileProductCatalogue: React.FC<
  ProductCatalogueProps &
    VaultFilterProps &
    DesktopProductCatalogueProps &
    VaultsDisplayVersionProps
> = (props) => <ProductCatalogueGridView {...props} variant="mobile" />;

export default MobileProductCatalogue;
