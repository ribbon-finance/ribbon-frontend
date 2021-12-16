import { isDevelopment } from "shared/lib/utils/env";
import {
  VaultNameOptionMap,
  VaultOptions,
  VaultVersion,
} from "shared/lib/constants/constants";

export const getVaultURI = (
  vaultOption: VaultOptions,
  vaultVersion: VaultVersion = "v1"
): string => {
  switch (vaultVersion) {
    case "v1":
      return `/theta-vault/${
        Object.keys(VaultNameOptionMap)[
          Object.values(VaultNameOptionMap).indexOf(vaultOption)
        ]
      }`;
    case "v2":
      return `/v2/theta-vault/${
        Object.keys(VaultNameOptionMap)[
          Object.values(VaultNameOptionMap).indexOf(vaultOption)
        ]
      }`;
  }
};
