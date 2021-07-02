import { FullVaultList } from "../constants/constants";

const ERC20TokenList = [
  "weth",
  "usdc",
  "wbtc",
  "yvusdc",
  ...FullVaultList,
] as const;
export type ERC20Token = typeof ERC20TokenList[number];
