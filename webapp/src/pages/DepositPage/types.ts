import { BigNumber } from "ethers";

export interface UnconnectedVaultData {
  deposits: BigNumber;
  vaultLimit: BigNumber;
}

export interface UserSpecificData {
  shareBalance: BigNumber;
  assetBalance: BigNumber;
}

export type ConnectedVaultData = UnconnectedVaultData & UserSpecificData;

export type VaultDataResponse =
  | { status: "loading" }
  | {
      status: "loaded_unconnected";
      data: UnconnectedVaultData;
    }
  | {
      status: "loaded_connected";
      data: ConnectedVaultData;
    };
