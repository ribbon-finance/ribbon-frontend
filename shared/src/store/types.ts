import { BigNumber } from "ethers";
import { Moment } from "moment";

import { VaultOptions } from "../constants/constants";

export const AssetsList = [
  "AAVE",
  "WAVAX",
  "sAVAX",
  "WETH",
  "USDC",
  "USDC.e",
  "WBTC",
  "stETH",
  "rETH",
  "wstETH",
  "yvUSDC",
  "RBN",
  "veRBN",
  "LDO",
  "SOL",
  "APE",
  // Treasury
  "PERP",
  "BAL",
] as const;
export type Assets = typeof AssetsList[number];

export const WalletsList = [
  "Metamask",
  "WalletConnect",
  "WalletLink",
  "Phantom",
  "Solflare",
] as const;
export type Wallets = typeof WalletsList[number];

export const GovernanceStakeTransactions = [
  "governanceStake",
  "governanceIncreaseAmount",
  "governanceIncreaseDuration",
] as const;
export type GovernanceStakeTransactionsType =
  typeof GovernanceStakeTransactions[number];

export const GovernanceApproveUnstakeTransactions = [
  "governanceApproval",
  "governanceUnstake",
] as const;
export type GovernanceApproveUnstakeTransactionsType =
  typeof GovernanceApproveUnstakeTransactions[number];

export type PendingTransaction = {
  txhash: string;
  status?: "success" | "error";
} & (
  | {
      type: "withdraw" | "withdrawInitiation" | "migrate";
      amount: string;
      vault: VaultOptions;
    }
  | {
      type: "deposit" | "approval";
      amount: string;
      vault: VaultOptions;
      asset: Assets;
    }
  | {
      type: "claim";
      amount: string;
    }
  | {
      type: "stakingApproval";
      amount: string;
      stakeAsset: VaultOptions;
    }
  | {
      type: "stake" | "unstake";
      amount: string;
      stakeAsset: VaultOptions;
    }
  | {
      type: "rewardClaim";
      amount: string;
      stakeAsset: VaultOptions;
    }
  | {
      type: "transfer";
      amount: string;
      transferVault: VaultOptions;
      receiveVault: VaultOptions;
    }
  | {
      type: "pause";
      amount: string;
      vault: VaultOptions;
      asset: Assets;
    }
  | {
      type: "resume";
      amount: string;
      vault: VaultOptions;
      asset: Assets;
    }
  /**
   * Governance transaction
   */
  | {
      type: GovernanceStakeTransactionsType;
      amount: string;
      expiry: Moment;
    }
  | {
      type: GovernanceApproveUnstakeTransactionsType;
      amount: string;
    }
  // Revenue Claim transaction
  | {
      type: "protocolRevenueClaim";
      amountETH: string;
    }
  | {
      type: "protocolPenaltyClaim";
      amountRBN: string;
    }
  | {
      // Apply veBoost to the current user
      type: "userCheckpoint";
      vault: VaultOptions;
    }
);

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
