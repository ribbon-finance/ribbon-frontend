import { FullVaultList } from "../constants/constants";

export const ERC20TokenList = [
  "weth",
  "usdc",
  "wbtc",
  "yvusdc",
  "steth",
  "rbn",
  ...FullVaultList,
] as const;
export type ERC20Token = typeof ERC20TokenList[number];

export const getERC20TokenDecimals = (asset: ERC20Token): number => {
  switch (asset) {
    case "usdc":
    case "yvusdc":
      return 6;
    case "wbtc":
      return 8;
    default:
      return 18;
  }
};

export const getERC20TokenDisplay = (asset: ERC20Token): string => {
  switch (asset) {
    case "yvusdc":
      return "yvUSDC";
    case "steth":
      return "stETH";
    default:
      return asset.toUpperCase();
  }
};
