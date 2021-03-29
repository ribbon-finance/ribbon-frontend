export type ProductType =
  | "yield"
  | "volatility"
  | "principalProtection"
  | "capitalAccumulation";

export interface DynamicMarginProps {
  empty: number;
}

export interface ProductTabProps {
  selected: boolean;
  type: ProductType;
}

export interface ArrowButtonProps {
  direction: "left" | "right";
}

export interface HeaderScrollIndicatorProps {
  direction: "left" | "right";
  show: boolean;
}
