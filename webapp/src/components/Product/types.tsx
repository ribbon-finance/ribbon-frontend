export type ProductType =
  | "yield"
  | "volatility"
  | "principalProtection"
  | "capitalAccumulation";

export interface ProductTabProps {
  selected: boolean;
  type: ProductType;
}

export interface ArrowButtonProps {
  direction: "left" | "right";
}
