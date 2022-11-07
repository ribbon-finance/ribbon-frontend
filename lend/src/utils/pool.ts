import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import {
  getDisplayAssets,
  PoolAddressMap,
  PoolOptions,
} from "../constants/constants";
import { getAssetColor } from "./asset";

export const isPoolFull = (
  deposits: BigNumber,
  cap: BigNumber,
  decimals: number
) => {
  const margin = parseUnits("0.01", decimals);
  return !cap.isZero() && deposits.gte(cap.sub(margin));
};

export const isPoolSupportedOnChain = (
  poolOption: PoolOptions,
  chainId: number
): Boolean => {
  return PoolAddressMap[poolOption].chainId === chainId;
};

export const getPoolColor = (pool: PoolOptions) =>
  getAssetColor(getDisplayAssets(pool));
