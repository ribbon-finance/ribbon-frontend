import { BigNumber } from "ethers";
import { Moment } from "moment";

import { VaultOptions } from "../constants/constants";

export const NotificationTypeList = [
  "optionMinting",
  "optionSale",
  "withdrawalReady",
] as const;
export type NotificationType = typeof NotificationTypeList[number];

interface NotificationMeta {
  date: Moment;
}

export interface OptionMintingNotification extends NotificationMeta {
  type: typeof NotificationTypeList[0];
  vault: VaultOptions;
  mintAmount: BigNumber;
  strikePrice: BigNumber;
  openedAt: number;
}

export interface OptionSaleNotification extends NotificationMeta {
  type: typeof NotificationTypeList[1];
  vault: VaultOptions;
  sellAmount: BigNumber;
  premium: BigNumber;
  timestamp: number;
}

export interface withdrawalReadyNotification extends NotificationMeta {
  type: typeof NotificationTypeList[2];
  vault: VaultOptions;
  amount: BigNumber;
}

export type Notification =
  | OptionMintingNotification
  | OptionSaleNotification
  | withdrawalReadyNotification;
