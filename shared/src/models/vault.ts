import { BigNumber } from "ethers";
import {
  getAssets,
  getDisplayAssets,
  VaultList,
  VaultOptions,
  VaultVersion,
  VaultVersionList,
} from "../constants/constants";
import { Assets } from "../store/types";
import { getAssetDecimals } from "../utils/asset";

export interface Vault {
  id: string;
  name: string;
  symbol: VaultOptions;
  numDepositors: number;
  totalPremiumEarned: number;
  totalWithdrawalFee: number;
  depositors: string[];
}

export interface VaultAccount {
  id: string;
  vault: Vault;
  account: string;
  updateCounter: number;
  totalYieldEarned: BigNumber;
  totalDeposits: BigNumber;
  totalBalance: BigNumber;
  totalStakedShares: BigNumber;
  totalStakedBalance: BigNumber;
  totalPendingDeposit: BigNumber;
}

export type VaultAccountsData = {
  [version in VaultVersion]: {
    [option in VaultOptions]: VaultAccount | undefined;
  };
};

export const defaultVaultAccountsData: VaultAccountsData = Object.fromEntries(
  VaultVersionList.map((version) => [
    version,
    Object.fromEntries(VaultList.map((option) => [option, undefined])),
  ])
) as VaultAccountsData;

export interface VaultShortPosition {
  id: string;
  vault: Vault;
  option: string;
  depositAmount: BigNumber;
  mintAmount: BigNumber;
  initiatedBy: string;
  strikePrice: BigNumber;
  expiry: number;
  openedAt: number;
  closedAt?: number;
  premiumEarned: BigNumber;
  openTxhash: string;
  closeTxhash: string;
  trades: VaultOptionTrade[];
}

export interface VaultOptionTrade {
  id: string;
  vault: Vault;
  vaultShortPosition: VaultShortPosition;
  sellAmount: BigNumber;
  premium: BigNumber;
  timestamp: number;
  txhash: string;
}

export type VaultTransactionType =
  | "deposit"
  | "withdraw"
  | "transfer"
  | "receive"
  | "stake"
  | "unstake"
  | "migrate";

export interface VaultTransaction {
  id: string;
  vault: Vault;
  type: VaultTransactionType;
  address: string;
  txhash: string;
  timestamp: number;
  amount: BigNumber;
  underlyingAmount: BigNumber;
  fee: number;
  vaultVersion: VaultVersion;
}

export interface BalanceUpdate {
  id: string;
  vault: Vault;
  account: string;
  timestamp: number;
  balance: BigNumber;
  yieldEarned: BigNumber;
  isWithdraw: boolean;
  stakedBalance: BigNumber;
  vaultVersion: VaultVersion;
}

export type VaultActivityType = "minting" | "sales";

export interface VaultActivityMeta {
  date: Date;
}

export type VaultActivity =
  | (VaultShortPosition & VaultActivityMeta & { type: "minting" })
  | (VaultOptionTrade & VaultActivityMeta & { type: "sales" });

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
export type VaultDataResponse = UnconnectedVaultData & UserSpecificData;

export type VaultDataResponses = {
  [vault in VaultOptions]: VaultDataResponse;
};

export type VaultData = {
  responses: VaultDataResponses;
  loading: boolean;
};

export const defaultVaultData: VaultData = {
  responses: Object.fromEntries(
    VaultList.map((vault) => [
      vault,
      {
        deposits: BigNumber.from("0"),
        vaultLimit: BigNumber.from("0"),
        vaultBalanceInAsset: BigNumber.from("0"),
        vaultMaxWithdrawAmount: BigNumber.from("0"),
        asset: getAssets(vault),
        displayAsset: getDisplayAssets(vault),
        decimals: getAssetDecimals(getAssets(vault)),
        userAssetBalance: BigNumber.from("0"),
        maxWithdrawAmount: BigNumber.from("0"),
      },
    ])
  ) as VaultDataResponses,
  loading: true,
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

export type V2VaultDataResponse = UnconnectedV2VaultData & ConnectedV2VaultData;
export type V2VaultDataResponses = {
  [vault in VaultOptions]: V2VaultDataResponse;
};

export type V2VaultData = {
  responses: V2VaultDataResponses;
  loading: boolean;
};

export const defaultV2VaultData: V2VaultData = {
  responses: Object.fromEntries(
    VaultList.map((vault) => [
      vault,
      {
        totalBalance: BigNumber.from(0),
        cap: BigNumber.from(0),
        decimals: getAssetDecimals(getAssets(vault)),
        asset: getAssets(vault),
        displayAsset: getDisplayAssets(vault),
        pricePerShare: BigNumber.from(0),
        round: 1,
        lockedBalanceInAsset: BigNumber.from(0),
        depositBalanceInAsset: BigNumber.from(0),
        userAssetBalance: BigNumber.from(0),
        withdrawals: {
          shares: BigNumber.from(0),
          amount: BigNumber.from(0),
          round: 1,
        },
      },
    ])
  ) as V2VaultDataResponses,
  loading: true,
};
