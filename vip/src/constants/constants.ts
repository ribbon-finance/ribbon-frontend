import { BigNumber } from "ethers";
import {
  getAssets,
  VIPVaultList,
  VaultNameOptionMap,
  VaultOptions,
} from "shared/lib/constants/constants";
import { getAssetDecimals } from "shared/lib/utils/asset";

export type VIPVaultOptions = typeof VIPVaultList[number];

export const hashCode: {
  [vault in VIPVaultOptions]: string;
} = {
  "rVIP-wBTC":
    "0xa1e9307fa0af394a591a9d447a7f1ec862de19ab669140b5ad50e8958389fb35",
  "rVIP-USDC":
    "0x17d0a0373c697b3fd118b3d17830db65e0e8bf48731ec235f776c0e54bc0cb07",
};

export const minDeposit: { [vault in VIPVaultOptions]: BigNumber } = {
  "rVIP-wBTC": BigNumber.from(10).pow(getAssetDecimals(getAssets("rVIP-wBTC"))), // minDeposit of 1 wBTC
  "rVIP-USDC": BigNumber.from(10).pow(getAssetDecimals(getAssets("rVIP-USDC"))), // minDeposit of 1 USDC
};

export const getVaultURI = (vaultOption: VaultOptions): string => {
  return `/vip/${
    Object.keys(VaultNameOptionMap)[
      Object.values(VaultNameOptionMap).indexOf(vaultOption)
    ]
  }`;
};
