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
