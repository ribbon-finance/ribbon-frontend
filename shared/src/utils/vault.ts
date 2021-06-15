import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { getAssets, VaultOptions } from "../constants/constants";
import { getAssetColor } from "./asset";

export const isVaultFull = (
  deposits: BigNumber,
  cap: BigNumber,
  decimals: number
) => {
  const margin = parseUnits("0.01", decimals);
  return !cap.isZero() && deposits.gte(cap.sub(margin));
};

export const isETHVault = (vault: VaultOptions) => vault === "rETH-THETA";

export const getVaultColor = (vault: VaultOptions) =>
  getAssetColor(getAssets(vault));
