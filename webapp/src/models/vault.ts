import { BigNumber } from "ethers";

export interface Vault {
  id: string;
  name: string;
  symbol: string;
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
}

export interface VaultShortPosition {
  id: string;
  vault: Vault;
  option: string;
  depositAmount: BigNumber;
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

export interface VaultTransaction {
  id: string;
  vault: Vault;
  type: "deposit" | "withdraw";
  address: string;
  txhash: string;
  timestamp: number;
  amount: BigNumber;
  fee: number;
}

export interface BalanceUpdate {
  id: string;
  vault: Vault;
  account: string;
  timestamp: number;
  balance: BigNumber;
  yieldEarned: BigNumber;
}

export type VaultActivityType = "minting" | "sales";

export interface VaultActivityMeta {
  date: Date;
}

export type VaultActivity =
  | (VaultShortPosition & VaultActivityMeta & { type: "minting" })
  | (VaultOptionTrade & VaultActivityMeta & { type: "sales" });
