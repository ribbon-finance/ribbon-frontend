import { BigNumber } from "ethers";
import {
  getAssets,
  VIPVaultList,
  VaultNameOptionMap,
  VaultOptions,
} from "shared/lib/constants/constants";
import { getAssetDecimals } from "shared/lib/utils/asset";

export type VIPVaultOptions = typeof VIPVaultList[number];

export const minDeposit: { [vault in VIPVaultOptions]: BigNumber } = {
  "rVIP-wBTC": BigNumber.from(10).pow(getAssetDecimals(getAssets("rVIP-wBTC"))), // minDeposit of 1 wBTC
  "rVIP-USDC": BigNumber.from(10).pow(getAssetDecimals(getAssets("rVIP-USDC"))), // minDeposit of 1 USDC
  "rVIP-VOL": BigNumber.from(10).pow(5),
  "rVIP-VOL-TWO": BigNumber.from(10).pow(5),
};

export const getVaultURI = (vaultOption: VaultOptions): string => {
  return `/trades/${
    Object.keys(VaultNameOptionMap)[
      Object.values(VaultNameOptionMap).indexOf(vaultOption)
    ]
  }`;
};
