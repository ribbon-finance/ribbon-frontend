import {
  EVMVaultList,
  StakingVaultOptions,
  TreasuryVaultList,
  VaultVersion,
  VaultVersionList,
} from "../constants/constants";

export const ERC20TokenList = [
  "weth",
  "usdc",
  "wbtc",
  "yvusdc",
  "steth",
  "wsteth",
  "ldo",
  "aave",
  "rbn",
  "verbn",
  "wavax",
  "savax",
  "perp",
  ...VaultVersionList.flatMap((version) =>
    EVMVaultList.map((option) => `${option}-${version}` as const)
  ),
  ...VaultVersionList.flatMap((version) =>
    TreasuryVaultList.map((option) => `${option}-${version}` as const)
  ),
] as const;
export type ERC20Token = typeof ERC20TokenList[number];

export const getERC20TokenNameFromVault = (
  vault: StakingVaultOptions,
  version: VaultVersion
): ERC20Token => {
  return `${vault}-${version}` as const;
};

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
    case "verbn":
      return "veRBN";
    default:
      return asset.toUpperCase();
  }
};
