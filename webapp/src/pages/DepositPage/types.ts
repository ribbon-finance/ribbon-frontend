import { BigNumber } from "ethers";

export interface UnconnectedVaultData {
  deposits: BigNumber;
  vaultLimit: BigNumber;
}

export interface UserSpecificData {
  shareBalance: BigNumber;
  // assetBalance: BigNumber;
}

export type ConnectedVaultData = UnconnectedVaultData & UserSpecificData;

export type DataResponseStatus = "loading" | "success";

export type VaultDataResponse = {
  status: DataResponseStatus;
} & ConnectedVaultData;
