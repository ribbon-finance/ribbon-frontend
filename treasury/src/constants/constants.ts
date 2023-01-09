import { BigNumber, ethers } from "ethers";
import {
  getAssets,
  TreasuryVaultList,
  VaultNameOptionMap,
  VaultOptions,
  VaultVersion,
} from "shared/lib/constants/constants";
import { getAssetDecimals } from "shared/lib/utils/asset";

export type TreasuryVaultOptions = typeof TreasuryVaultList[number];

export const hashCode: {
  [vault in TreasuryVaultOptions]: string;
} = {
  "rPERP-TSRY":
    "0x86658217590fbd9edf0a68c0574d138a341d027a6c2d36c4c9021d0adb149df2",
  "rBAL-TSRY":
    "0x7c63a217c290a6c8fe3107c122460c39fce1cd883d513582bd6e1a7b3ad5e021",
  "rBADGER-TSRY":
    "0x0b2f29370321c3c56be651f077eaa3af49528b67d6a84e11657b7e60d2fd7c07",
  "rSPELL-TSRY":
    "0x43d708aa36cb2ad46d13ce5f1b32eca3d34215b0b96aca2e341c6d325d0b8a48",
  "rSAMB-TSRY":
    "0xa3423956edbd6a601b054932c817d6f845bf9bf0303cef7e47ac9a580a4e77dc",
  "rVIP-wBTC":
    "0xa1e9307fa0af394a591a9d447a7f1ec862de19ab669140b5ad50e8958389fb35",
};

export const minDeposit: { [vault in TreasuryVaultOptions]: BigNumber } = {
  "rPERP-TSRY": ethers.utils.parseEther("500"),
  "rBAL-TSRY": ethers.utils.parseEther("100"),
  "rBADGER-TSRY": ethers.utils.parseEther("100"),
  "rSPELL-TSRY": ethers.utils.parseEther("3000"),
  "rSAMB-TSRY": ethers.utils.parseEther("3000"),
  "rVIP-wBTC": BigNumber.from(10).pow(getAssetDecimals(getAssets("rVIP-wBTC"))), // minDeposit of 1 wBTC
};

export const getVaultURI = (
  vaultOption: VaultOptions,
  vaultVersion: VaultVersion = "v2"
): string => {
  switch (vaultVersion) {
    case "v1":
      return `/treasury/${
        Object.keys(VaultNameOptionMap)[
          Object.values(VaultNameOptionMap).indexOf(vaultOption)
        ]
      }`;
    case "v2":
      return `/treasury/${
        Object.keys(VaultNameOptionMap)[
          Object.values(VaultNameOptionMap).indexOf(vaultOption)
        ]
      }`;
    default:
      return "";
  }
};
