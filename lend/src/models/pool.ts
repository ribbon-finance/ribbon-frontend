import { BigNumber } from "ethers";
import { PoolList, PoolOptions } from "shared/lib/constants/lendConstants";
import {
  PoolVersion,
  PoolVersionList,
} from "shared/lib/constants/lendConstants";
export interface Pool {
  id: string;
  name: string;
  symbol: PoolOptions;
  numDepositors: number;
  totalBalance: BigNumber;
  totalNominalVolume: BigNumber;
  totalNotionalVolume: BigNumber;
  depositors: string[];
}

export type PoolsSubgraphData = {
  [version in PoolVersion]: {
    [option in PoolOptions]: Pool | undefined;
  };
};

export const defaultPoolsData: PoolsSubgraphData = Object.fromEntries(
  PoolVersionList.map((version) => [
    version,
    Object.fromEntries(PoolList.map((option) => [option, undefined])),
  ])
) as PoolsSubgraphData;

export interface PoolAccount {
  id: PoolVersion;
  pool: Pool;
  account: string;
  updateCounter: number;
  totalYieldEarned: BigNumber;
  totalDeposits: BigNumber;
  totalBalance: BigNumber;
}

export type PoolAccountsData = {
  [version in PoolVersion]: {
    [option in PoolOptions]: PoolAccount | undefined;
  };
};

export const defaultPoolAccountsData: PoolAccountsData = Object.fromEntries(
  PoolVersionList.map((version) => [
    version,
    Object.fromEntries(PoolList.map((option) => [option, undefined])),
  ])
) as PoolAccountsData;

export interface PoolBorrow {
  id: string;
  borrowAmount: BigNumber;
  borrowedAt: number;
  borrowTxhash: string;
}

export interface PoolRepay {
  id: string;
  repaidAmount: BigNumber;
  repaidAt: number;
  repayTxhash: string;
}

export type PoolTransactionType =
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

export interface PoolTransaction {
  id: string;
  pool: Pool;
  type: PoolTransactionType;
  address: string;
  txhash: string;
  timestamp: number;
  amount: BigNumber;
  underlyingAmount: BigNumber;
  fee: number;
  poolVersion: PoolVersion;
}

export interface BalanceUpdate {
  id: string;
  pool: Pool;
  account: string;
  timestamp: number;
  balance: BigNumber;
  yieldEarned: BigNumber;
  isWithdraw: boolean;
  poolVersion: PoolVersion;
}

export type PoolActivityType = "borrow" | "repay";

export interface PoolActivityMeta {
  date: Date;
}

export type PoolActivity =
  | (PoolBorrow & PoolActivityMeta & { type: "borrow" })
  | (PoolRepay & PoolActivityMeta & { type: "repay" });

export type PoolActivitiesData = {
  [version in PoolVersion]: {
    [option in PoolOptions]: PoolActivity[];
  };
};

export const defaultPoolActivitiesData: PoolActivitiesData = Object.fromEntries(
  PoolVersionList.map((version) => [
    version,
    Object.fromEntries(
      PoolList.map((option) => [option, [] as PoolActivity[]])
    ),
  ])
) as PoolActivitiesData;

export interface UnconnectedPoolData {
  poolSize: BigNumber;
  availableToWithdraw: BigNumber;
  utilizationRate: BigNumber;
  poolLimit: BigNumber;
  availableToBorrow: BigNumber;
  currentExchangeRate: BigNumber;
  poolMaxWithdrawAmount: BigNumber;
  supplyRate: BigNumber;
  rewardPerSecond: BigNumber;
  manager: string;
  borrows: BigNumber;
  reserveFactor: BigNumber;
}

export interface UserSpecificData {
  poolBalanceInAsset: BigNumber;
  maxWithdrawAmount: BigNumber;
  accumulativeReward: BigNumber;
  withdrawableReward: BigNumber;
  withdrawnReward: BigNumber;
}
export type PoolDataResponse = UnconnectedPoolData & UserSpecificData;

export type PoolDataResponses = {
  [pool in PoolOptions]: PoolDataResponse;
};

export type PoolData = {
  responses: PoolDataResponses;
  loading: boolean;
};

export const defaultPoolData: PoolData = {
  responses: Object.fromEntries(
    PoolList.map((pool) => [
      pool,
      {
        poolSize: BigNumber.from("0"),
        availableToWithdraw: BigNumber.from("0"),
        utilizationRate: BigNumber.from("0"),
        poolLimit: BigNumber.from("0"),
        availableToBorrow: BigNumber.from("0"),
        currentExchangeRate: BigNumber.from("0"),
        manager: "0x0",
        borrows: BigNumber.from("0"),
        reserveFactor: BigNumber.from("0"),
        poolBalanceInAsset: BigNumber.from("0"),
        poolMaxWithdrawAmount: BigNumber.from("0"),
        maxWithdrawAmount: BigNumber.from("0"),
        accumulativeReward: BigNumber.from("0"),
        withdrawableReward: BigNumber.from("0"),
        withdrawnReward: BigNumber.from("0"),
      },
    ])
  ) as PoolDataResponses,
  loading: true,
};
