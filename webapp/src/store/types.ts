import { BigNumber } from "ethers";
import { VaultOptions } from "../constants/constants";

export const AssetsList = ["WETH", "WBTC"] as const;
export type Assets = typeof AssetsList[number];
export interface UnconnectedVaultData {
  deposits: BigNumber;
  vaultLimit: BigNumber;
  decimals: number;
  asset: Assets;
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

export type VaultDataResponses = {
  [vault in VaultOptions]: VaultDataResponse;
};

export type PendingTransaction = {
  txhash: string;
  type: "deposit" | "withdraw";
  amount: string;
};
