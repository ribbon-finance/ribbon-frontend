import { BigNumber } from "ethers";
import { VaultOptions } from "../constants/constants";
import { DefiScoreProtocol, DefiScoreToken } from "../models/defiScore";

export const AssetsList = ["WETH", "WBTC", "USDC", "yvUSDC"] as const;
export type Assets = typeof AssetsList[number];
export interface UnconnectedVaultData {
  deposits: BigNumber;
  vaultLimit: BigNumber;
  decimals: number;
  asset: Assets;
  displayAsset: Assets;
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

export type PendingTransaction =
  | {
      txhash: string;
      type: "deposit" | "withdraw" | "approval";
      amount: string;
      vault: VaultOptions;
    }
  | {
      txhash: string;
      type: "claim";
      amount: string;
    }
  | {
      txhash: string;
      type: "approval";
      amount: string;
      stakeAsset: VaultOptions;
    }
  | {
      txhash: string;
      type: "stake" | "unstake";
      amount: string;
      stakeAsset: VaultOptions;
    }
  | {
      txhash: string;
      type: "rewardClaim";
      amount: string;
      stakeAsset: VaultOptions;
    };

export type AssetYieldsInfoData = {
  [token in DefiScoreToken]: Array<{
    protocol: DefiScoreProtocol;
    apr: number;
  }>;
};
