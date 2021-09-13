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
  vaultMaxWithdrawAmount: BigNumber;
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

export interface UnconnectedV2VaultData {
  totalBalance: BigNumber;
  cap: BigNumber;
  decimals: number;
  asset: Assets;
  displayAsset: Assets;
  pricePerShare: BigNumber;
  round: number;
}

/**
 * lockedBalanceInAsset: Locked portion of position in the vault
 * depositBalanceInAsset: Portion where it allow for withdrawInstantly
 * userAssetBalance: User asset balance
 */
export interface ConnectedV2VaultData {
  lockedBalanceInAsset: BigNumber;
  depositBalanceInAsset: BigNumber;
  userAssetBalance: BigNumber;
  withdrawals: {
    shares: BigNumber;
    amount: BigNumber;
    round: number;
  };
}

export type V2VaultDataResponse = UnconnectedV2VaultData &
  ConnectedV2VaultData & {
    lastFetched?: number;
  };

export type V2VaultDataResponses = {
  [vault in VaultOptions]: V2VaultDataResponse;
};

export type PendingTransaction =
  | {
      txhash: string;
      type: "deposit" | "withdraw" | "approval" | "migrate";
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
    }
  | {
      txhash: string;
      type: "transfer";
      amount: string;
      transferVault: VaultOptions;
      receiveVault: VaultOptions;
    };

export type AssetYieldsInfoData = {
  [token in DefiScoreToken]: Array<{
    protocol: DefiScoreProtocol;
    apr: number;
  }>;
};

export type AirdropInfoData = {
  account: string;
  total: number;
  proof: {
    index: number;
    amount: BigNumber;
    proof: string[];
  };
  breakdown: {
    [key: string]: number;
  };
  claimed: boolean;
};
