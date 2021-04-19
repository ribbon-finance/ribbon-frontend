import { Assets } from "../store/types";

export const getAssetDisplay = (asset: Assets): string => {
  switch (asset) {
    case "WETH":
      return "ETH";
    default:
      return asset;
  }
};

export const getAssetDecimals = (asset: Assets): number => {
  switch (asset) {
    case "WETH":
      return 18;
    case "WBTC":
      return 8;
  }
};
