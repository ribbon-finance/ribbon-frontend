import { BigNumber } from "ethers";
import {
  SolanaVaultList,
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
  totalNominalVolume?: BigNumber;
  totalNotionalVolume: BigNumber;
  totalWithdrawalFee?: BigNumber; // v1
  totalFeeCollected?: BigNumber; // v2
  totalBorrowed?: BigNumber;
  principalOutstanding?: BigNumber;
  numberOfHits?: number;
  optionsTraded?: number;
  underlyingAsset: string;
  underlyingSymbol: string;
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
  id: string;
  vault: Vault;
  account: string;
  updateCounter: number;
  totalYieldEarned: BigNumber;
  totalDeposits: BigNumber;
  totalBalance: BigNumber;
  totalStakedShares: BigNumber;
  totalStakedBalance: BigNumber;
  totalPendingDeposit: BigNumber;
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

export interface VaultShortPosition {
  id: string;
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
  vaultShortPosition: VaultShortPosition;
  sellAmount: BigNumber;
  premium: BigNumber;
  timestamp: number;
  txhash: string;
}

export interface VaultOpenLoan {
  id: string;
  loanAmount: BigNumber;
  timestamp: number;
  openedAt: number;
  openTxhash: string;
}

export interface VaultCloseLoan {
  id: string;
  paidAmount: BigNumber;
  timestamp: number;
  closedAt: number;
  closeTxhash: string;
}

export interface VaultOptionSold {
  id: string;
  premium: BigNumber;
  optionSeller: string;
  timestamp: number;
  soldAt: number;
  txhash: string;
}

export interface VaultOptionYield {
  id: string;
  _yield: BigNumber;
  netYield: BigNumber;
  timestamp: number;
  paidAt: number;
  txhash: string;
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
  stakedBalance: BigNumber;
  vaultVersion: VaultVersion;
}

export type VaultActivityType =
  | "minting"
  | "sales"
  | "openLoan"
  | "closeLoan"
  | "optionSold"
  | "optionYield";

export interface VaultActivityMeta {
  date: Date;
}

export type VaultActivity =
  | (VaultShortPosition & VaultActivityMeta & { type: "minting" })
  | (VaultOptionTrade & VaultActivityMeta & { type: "sales" })
  | (VaultOpenLoan & VaultActivityMeta & { type: "openLoan" })
  | (VaultCloseLoan & VaultActivityMeta & { type: "closeLoan" })
  | (VaultOptionSold & VaultActivityMeta & { type: "optionSold" })
  | (VaultOptionYield & VaultActivityMeta & { type: "optionYield" });

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
  deposits: BigNumber;
  vaultLimit: BigNumber;
  vaultMaxWithdrawAmount: BigNumber;
}

export interface UserSpecificData {
  vaultBalanceInAsset: BigNumber;
  maxWithdrawAmount: BigNumber;
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
        deposits: BigNumber.from("0"),
        vaultLimit: BigNumber.from("0"),
        vaultBalanceInAsset: BigNumber.from("0"),
        vaultMaxWithdrawAmount: BigNumber.from("0"),
        maxWithdrawAmount: BigNumber.from("0"),
      },
    ])
  ) as VaultDataResponses,
  loading: true,
};

export interface UnconnectedV2VaultData {
  totalBalance: BigNumber;
  cap: BigNumber;
  pricePerShare: BigNumber;
  round: number;
  roundPricePerShare: BigNumber;
  strikePrice: BigNumber;
  allocationState: {
    loanAllocationPCT: number;
    optionAllocationPCT: number;
  };
}

/**
 * lockedBalanceInAsset: Locked portion of position in the vault
 * depositBalanceInAsset: Portion where it allow for withdrawInstantly
 */
export interface ConnectedV2VaultData {
  lockedBalanceInAsset: BigNumber;
  shares: BigNumber;
  depositBalanceInAsset: BigNumber;
  withdrawals: {
    shares: BigNumber;
    round: number;
  };
}

export type V2VaultDataResponse = UnconnectedV2VaultData & ConnectedV2VaultData;
export type V2VaultDataResponses = {
  [vault in VaultOptions]: V2VaultDataResponse;
};
type SolanaVaultOptions = typeof SolanaVaultList[number];

export type SolanaVaultDataResponses = {
  [vault in SolanaVaultOptions]: V2VaultDataResponse;
};
export type SolanaVaultData = {
  responses: SolanaVaultDataResponses;
  loading: boolean;
};

export type V2VaultData = {
  responses: V2VaultDataResponses;
  loading: boolean;
};

export const defaultV2VaultData: V2VaultData = {
  responses: Object.fromEntries(
    VaultList.map((vault) => [
      vault,
      {
        totalBalance: BigNumber.from(0),
        cap: BigNumber.from(0),
        pricePerShare: BigNumber.from(0),
        roundPricePerShare: BigNumber.from(0),
        round: 1,
        strikePrice: BigNumber.from(0),
        lockedBalanceInAsset: BigNumber.from(0),
        depositBalanceInAsset: BigNumber.from(0),
        withdrawals: {
          shares: BigNumber.from(0),
          round: 1,
        },
        allocationState: {
          loanAllocationPCT: 0,
          optionAllocationPCT: 0,
        },
      },
    ])
  ) as V2VaultDataResponses,
  loading: true,
};

export const defaultSolanaVaultData: SolanaVaultData = {
  responses: Object.fromEntries(
    SolanaVaultList.map((vault) => [
      vault as SolanaVaultOptions,
      {
        totalBalance: BigNumber.from(0),
        cap: BigNumber.from(0),
        pricePerShare: BigNumber.from(0),
        round: 1,
        lockedBalanceInAsset: BigNumber.from(0),
        depositBalanceInAsset: BigNumber.from(0),
        withdrawals: {
          shares: BigNumber.from(0),
          round: 1,
        },
      },
    ])
  ) as SolanaVaultDataResponses,
  loading: true,
};

export type VaultPriceHistory = {
  pricePerShare: BigNumber;
  round?: number;
  timestamp: number;
};

export type VaultPriceHistoriesData = {
  [version in VaultVersion]: {
    [vault in VaultOptions]: VaultPriceHistory[];
  };
};

export const defaultV2VaultPriceHistoriesData: VaultPriceHistoriesData =
  Object.fromEntries(
    VaultVersionList.map((version) => [
      version,
      Object.fromEntries(
        VaultList.map((vault) => [vault, [] as VaultPriceHistory[]])
      ),
    ])
  ) as VaultPriceHistoriesData;
