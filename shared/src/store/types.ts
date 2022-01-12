import { BigNumber } from "ethers";

import { VaultOptions } from "../constants/constants";

export const AssetsList = [
  "AAVE",
  "WAVAX",
  "WETH",
  "USDC",
  "WBTC",
  "stETH",
  "yvUSDC",
  "PERP",
] as const;
export type Assets = typeof AssetsList[number];

export type PendingTransaction = {
  txhash: string;
  status?: "success" | "error";
} & (
  | {
      type: "withdraw" | "withdrawInitiation" | "approval" | "migrate";
      amount: string;
      vault: VaultOptions;
    }
  | {
      type: "deposit";
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
