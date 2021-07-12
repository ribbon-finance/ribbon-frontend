import { BigNumber } from "ethers";
import { VaultOptions } from "../constants/constants";

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
}

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
  buyer: string;
  sellAmount: BigNumber;
  premium: BigNumber;
  optionToken: string;
  premiumToken: string;
  timestamp: number;
  txhash: string;
}

export type VaultTransactionType =
  | "deposit"
  | "withdraw"
  | "transfer"
  | "receive"
  | "stake"
  | "unstake";

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
}

export type VaultActivityType = "minting" | "sales";

export interface VaultActivityMeta {
  date: Date;
}

export type VaultActivity =
  | (VaultShortPosition & VaultActivityMeta & { type: "minting" })
  | (VaultOptionTrade & VaultActivityMeta & { type: "sales" });
