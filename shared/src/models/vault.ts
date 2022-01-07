import { BigNumber } from "ethers";
import {
  VaultList,
  VaultOptions,
  VaultVersion,
  VaultVersionList,
} from "../constants/constants";

export interface Vault {
  id: string;
  name: string;
  symbol: VaultOptions;
  numDepositors: number;
  totalBalance: BigNumber;
  // totalPremiumEarned: BigNumber;
  // totalWithdrawalFee: BigNumber;
  depositors: string[];
}

export type VaultsSubgraphData = {
  [version in VaultVersion]: {
    [option in VaultOptions]: Vault | undefined;
  };
};

export const defaultVaultsData: VaultsSubgraphData = Object.fromEntries(
  VaultVersionList.map((version) => [
    version,
    Object.fromEntries(VaultList.map((option) => [option, undefined])),
  ])
) as VaultsSubgraphData;

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
  vaultShortPosition: VaultShortPosition;
  sellAmount: BigNumber;
  premium: BigNumber;
  timestamp: number;
  txhash: string;
}

export type VaultTransactionType =
  | "deposit"
  | "withdraw"
  | "instantWithdraw"
  | "transfer"
  | "receive"
  | "stake"
  | "unstake"
  | "migrate"
  | "distribute";

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

export type VaultActivitiesData = {
  [version in VaultVersion]: {
    [option in VaultOptions]: VaultActivity[];
  };
};

export const defaultVaultActivitiesData: VaultActivitiesData =
  Object.fromEntries(
    VaultVersionList.map((version) => [
      version,
      Object.fromEntries(
        VaultList.map((option) => [option, [] as VaultActivity[]])
      ),
    ])
  ) as VaultActivitiesData;

export interface UnconnectedVaultData {
  deposits: BigNumber;
  vaultLimit: BigNumber;
  vaultMaxWithdrawAmount: BigNumber;
}

export interface UserSpecificData {
  vaultBalanceInAsset: BigNumber;
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
        maxWithdrawAmount: BigNumber.from("0"),
      },
    ])
  ) as VaultDataResponses,
  loading: true,
};

export interface UnconnectedV2VaultData {
  totalBalance: BigNumber;
  cap: BigNumber;
  pricePerShare: BigNumber;
  round: number;
}

/**
 * lockedBalanceInAsset: Locked portion of position in the vault
 * depositBalanceInAsset: Portion where it allow for withdrawInstantly
 */
export interface ConnectedV2VaultData {
  lockedBalanceInAsset: BigNumber;
  depositBalanceInAsset: BigNumber;
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
        pricePerShare: BigNumber.from(0),
        round: 1,
        lockedBalanceInAsset: BigNumber.from(0),
        depositBalanceInAsset: BigNumber.from(0),
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

export type VaultPriceHistory = {
  pricePerShare: BigNumber;
  timestamp: number;
};

export type VaultPriceHistoriesData = {
  [version in VaultVersion]: {
    [vault in VaultOptions]: VaultPriceHistory[];
  };
};

export const defaultV2VaultPriceHistoriesData: VaultPriceHistoriesData =
  Object.fromEntries(
    VaultVersionList.map((version) => [
      version,
      Object.fromEntries(
        VaultList.map((vault) => [vault, [] as VaultPriceHistory[]])
      ),
    ])
  ) as VaultPriceHistoriesData;
