import { BigNumber } from "ethers";

export interface UnconnectedVaultData {
  deposits: BigNumber;
  vaultLimit: BigNumber;
}

export type DataResponseStatus = "loading" | "success" | "error";

export type VaultDataErrors = "wrong_network";

export type VaultDataResponse = {
  status: DataResponseStatus;
  error: VaultDataErrors | null;
} & UnconnectedVaultData;

export type PendingTransaction = {
  txhash: string;
  type: "deposit" | "withdraw";
  amount: string;
};
