import {
  VaultNameOptionMap,
  VaultOptions,
  VaultVersion,
} from "shared/lib/constants/constants";

export const getVaultURI = (
  vaultOption: VaultOptions,
  vaultVersion: VaultVersion = "v1"
): string => {
  return `/treasury/${
    Object.keys(VaultNameOptionMap)[
      Object.values(VaultNameOptionMap).indexOf(vaultOption)
    ]
  }`;
};

interface Announcement {
  color: string;
  message: string;
  linkText: string;
  linkURI: string;
}

export const ANNOUNCEMENT: Announcement | undefined = {
  color: "#FFFFFF",
  message: "Near vaults have launched.",
  linkText: "Switch to Aurora",
  linkURI: "/",
};
