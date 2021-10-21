import React from "react";
import {
  VaultList,
  VaultOptions,
  VaultVersion,
} from "../../constants/constants";
import { Assets } from "../../store/types";

export const ProductList = [
  "yield",
  "volatility",
  "principalProtection",
  "capitalAccumulation",
] as const;

export type ProductType = typeof ProductList[number];

export interface DynamicMarginProps {
  empty: number;
}

export interface ProductTabProps {
  selected: boolean;
  type: ProductType;
}

export interface HeaderScrollIndicatorProps {
  direction: "left" | "right";
  show: boolean;
}

export interface ProductCatalogueProps {
  variant: "landing" | "webapp";
  onVaultPress: (vault: VaultOptions, vaultVersion: VaultVersion) => void;
}

export type DesktopViewType = "grid" | "gallery";

export const VaultStrategyList = ["COVERED-CALL", "PUT-SELLING"] as const;
export type VaultStrategy = typeof VaultStrategyList[number];

export const VaultSortByList = [
  "SORT BY",
  "NEWEST FIRST",
  "OLDEST FIRST",
  "YIELD: HIGH TO LOW",
  "YIELD: LOW TO HIGH",
] as const;
export type VaultSortBy = typeof VaultSortByList[number];
export const VaultSortByFilterOptions: Array<
  VaultSortBy | { display: string; value: VaultSortBy }
> = VaultSortByList.map((item) =>
  item === VaultSortByList[0]
    ? {
        display: "DEFAULT",
        value: item,
      }
    : item
);
export const VaultReleaseOrder: VaultOptions[] = VaultList;

export interface VaultSetFilterProps {
  setFilterStrategies: React.Dispatch<React.SetStateAction<VaultStrategy[]>>;
  setFilterAssets: React.Dispatch<React.SetStateAction<Assets[]>>;
}

export interface VaultFilterProps extends VaultSetFilterProps {
  filterStrategies: VaultStrategy[];
  filterAssets: Assets[];
  sort: VaultSortBy;
  setSort: React.Dispatch<React.SetStateAction<VaultSortBy>>;
}

export type VaultsDisplayVersion = {
  [vault in VaultOptions]: VaultVersion;
};

export type UserSelectedVaultsVersion = Partial<VaultsDisplayVersion>;

export type VaultsDisplayVersionProps = {
  vaultsDisplayVersion: VaultsDisplayVersion;
  setVaultDisplayVersion: (
    vaultOption: VaultOptions,
    vaultVersion: VaultVersion
  ) => void;
};
