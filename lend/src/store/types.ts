import { BigNumber } from "ethers";
import { PoolOptions } from "shared/lib/constants/lendConstants";

export interface UnconnectedPoolData {
  deposits: BigNumber;
  poolLimit: BigNumber;
}

export type DataResponseStatus = "loading" | "success" | "error";

export type PoolDataErrors = "wrong_network";

export type PoolDataResponse = {
  status: DataResponseStatus;
  error: PoolDataErrors | null;
} & UnconnectedPoolData;

export const AssetsList = ["RBN", "WETH", "USDC"] as const;
export type Assets = typeof AssetsList[number];

export const WalletsList = ["Metamask", "WalletConnect", "WalletLink"] as const;
export type Wallets = typeof WalletsList[number];

export type PendingTransaction = {
  txhash: string;
  status?: "success" | "error";
} & (
  | {
      type: "withdraw";
      amount: string;
      pool: PoolOptions;
    }
  | {
      type: "deposit" | "approval" | "repay" | "borrow";
      amount: string;
      pool: PoolOptions;
      asset: Assets;
    }
  | {
      type: "claim";
      amount: string;
    }
  | {
      type: "rewardClaim";
      amount: string;
      stakeAsset: PoolOptions;
    }
  | {
      type: "transfer";
      amount: string;
      transferPool: PoolOptions;
      receivePool: PoolOptions;
    }
);
