import { BigNumber } from "ethers";

import { VaultOptions } from "../constants/constants";
import { DefiScoreProtocol, DefiScoreToken } from "../models/defiScore";

export const AssetsList = ["WETH", "WBTC", "USDC", "yvUSDC"] as const;
export type Assets = typeof AssetsList[number];

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
