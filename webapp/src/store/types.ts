import { BigNumber } from "ethers";

export interface UnconnectedVaultData {
  deposits: BigNumber;
  vaultLimit: BigNumber;
}

export interface UserSpecificData {
  vaultBalanceInAsset: BigNumber;
  userAssetBalance: BigNumber;
  maxWithdrawAmount: BigNumber;
}

export type ConnectedVaultData = UnconnectedVaultData & UserSpecificData;

export type DataResponseStatus = "loading" | "success" | "error";

export type VaultDataErrors = "wrong_network";

export type VaultDataResponse = {
  status: DataResponseStatus;
  error: VaultDataErrors | null;
} & ConnectedVaultData;

export type PendingTransaction = {
  txhash: string;
  type: "deposit" | "withdraw";
  amount: string;
};
