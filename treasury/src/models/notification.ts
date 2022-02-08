import { BigNumber } from "ethers";
import { Moment } from "moment";

import { VaultOptions, VaultVersion } from "shared/lib/constants/constants";

export const NotificationTypeList = [
  "optionMinting",
  "optionSale",
  "withdrawalReady",
  "distributePremium",
] as const;
export type NotificationType = typeof NotificationTypeList[number];

interface NotificationMeta {
  date: Moment;
  vault: VaultOptions;
}

export interface OptionMintingNotification extends NotificationMeta {
  type: typeof NotificationTypeList[0];
  vaultVersion: VaultVersion;
  depositAmount: BigNumber;
  strikePrice: BigNumber;
  openedAt: number;
}

export interface OptionSaleNotification extends NotificationMeta {
  type: typeof NotificationTypeList[1];
  vaultVersion: VaultVersion;
  sellAmount: BigNumber;
  premium: BigNumber;
  timestamp: number;
}

export interface withdrawalReadyNotification extends NotificationMeta {
  type: typeof NotificationTypeList[2];
  vaultVersion: "v2";
  amount: BigNumber;
}

export interface distributePremiumNotification extends NotificationMeta {
  type: typeof NotificationTypeList[3];
  vaultVersion: "v2";
  amount: BigNumber;
}

export type Notification =
  | OptionMintingNotification
  | OptionSaleNotification
  | withdrawalReadyNotification
  | distributePremiumNotification;
