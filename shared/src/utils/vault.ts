import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import {
  getDisplayAssets,
  VaultAddressMap,
  VaultOptions,
} from "../constants/constants";
import { getAssetColor } from "./asset";

export const isVaultFull = (
  deposits: BigNumber,
  cap: BigNumber,
  decimals: number
) => {
  const margin = parseUnits("0.01", decimals);
  return !cap.isZero() && deposits.gte(cap.sub(margin));
};

export const isVaultSupportedOnChain = (
  vaultOption: VaultOptions,
  chainId: number
): Boolean => {
  return VaultAddressMap[vaultOption].chainId === chainId;
};

export const isETHVault = (vault: VaultOptions) =>
  ["rETH-THETA", "rstETH-THETA"].includes(vault);

export const getVaultColor = (vault: VaultOptions) =>
  getAssetColor(getDisplayAssets(vault));
