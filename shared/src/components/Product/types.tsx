import React from "react";
import { VaultList, VaultOptions } from "../../constants/constants";
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
  onVaultPress: (vault: VaultOptions) => void;
}

export type DesktopViewType = "grid" | "gallery";

export const VaultStrategyList = ["COVERED-CALL", "PUT-SELLING"] as const;
export type VaultStrategy = typeof VaultStrategyList[number];
export const VaultStrategyMap: {
  [vault in VaultOptions]: VaultStrategy;
} = {
  "rETH-THETA": "COVERED-CALL",
  "rBTC-THETA": "COVERED-CALL",
  "rUSDC-ETH-P-THETA": "PUT-SELLING",
  "rUSDC-BTC-P-THETA": "PUT-SELLING",
};

export const VaultSortByList = [
  "SORT BY",
  "NEWEST FIRST",
  "OLDEST FIRST",
  "YIELD: HIGH TO LOW",
  "YIELD: LOW TO HIGH",
] as const;
export type VaultSortBy = typeof VaultSortByList[number];
export const VaultReleaseOrder: VaultOptions[] = VaultList;

export interface VaultFilterProps {
  filterStrategies: VaultStrategy[];
  filterAssets: Assets[];
  sort: VaultSortBy;
  setFilterStrategies: React.Dispatch<React.SetStateAction<VaultStrategy[]>>;
  setFilterAssets: React.Dispatch<React.SetStateAction<Assets[]>>;
  setSort: React.Dispatch<React.SetStateAction<VaultSortBy>>;
}
