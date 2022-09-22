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
  totalNominalVolume: BigNumber;
  totalNotionalVolume: BigNumber;
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
  id: VaultVersion;
  vault: Vault;
  account: string;
  updateCounter: number;
  totalYieldEarned: BigNumber;
  totalDeposits: BigNumber;
  totalBalance: BigNumber;
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

export interface VaultBorrow {
  id: string;
  borrowAmount: BigNumber;
  borrowedAt: number;
  borrowTxhash: string;
}

export interface VaultRepay {
  id: string;
  repaidAmount: BigNumber;
  repaidAt: number;
  repayTxhash: string;
}

export type VaultTransactionType =
  | "deposit"
  | "withdraw"
  | "initiateWithdraw"
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
  vaultVersion: VaultVersion;
}

export type VaultActivityType = "borrow" | "repay";

export interface VaultActivityMeta {
  date: Date;
}

export type VaultActivity =
  | (VaultBorrow & VaultActivityMeta & { type: "borrow" })
  | (VaultRepay & VaultActivityMeta & { type: "repay" });

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
  poolSize: BigNumber;
  availableToWithdraw: BigNumber;
  utilizationRate: BigNumber;
  vaultLimit: BigNumber;
  currentExchangeRate: BigNumber;
  vaultMaxWithdrawAmount: BigNumber;
  supplyRate: BigNumber;
  rewardPerSecond: BigNumber;
}

export interface UserSpecificData {
  vaultBalanceInAsset: BigNumber;
  maxWithdrawAmount: BigNumber;
  accumulativeReward: BigNumber;
  withdrawableReward: BigNumber;
  withdrawnReward: BigNumber;
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
        poolSize: BigNumber.from("0"),
        availableToWithdraw: BigNumber.from("0"),
        utilizationRate: BigNumber.from("0"),
        vaultLimit: BigNumber.from("0"),
        currentExchangeRate: BigNumber.from("0"),
        vaultBalanceInAsset: BigNumber.from("0"),
        vaultMaxWithdrawAmount: BigNumber.from("0"),
        maxWithdrawAmount: BigNumber.from("0"),
        accumulativeReward: BigNumber.from("0"),
        withdrawableReward: BigNumber.from("0"),
        withdrawnReward: BigNumber.from("0"),
      },
    ])
  ) as VaultDataResponses,
  loading: true,
};
