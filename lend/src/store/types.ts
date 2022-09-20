import { BigNumber } from "ethers";
import { VaultOptions } from "../constants/constants";

export interface UnconnectedVaultData {
  deposits: BigNumber;
  vaultLimit: BigNumber;
}

export type DataResponseStatus = "loading" | "success" | "error";

export type VaultDataErrors = "wrong_network";

export type VaultDataResponse = {
  status: DataResponseStatus;
  error: VaultDataErrors | null;
} & UnconnectedVaultData;

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
