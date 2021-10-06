import { useCallback, useEffect, useState } from "react";
import moment from "moment";

import { getAssets, VaultOptions, VaultVersion } from "../constants/constants";
import { Notification } from "../models/notification";
import { useAllVaultActivities } from "./useVaultActivity";
import { useV2VaultsData } from "./vaultDataContext";
import { useAllVaultAccounts } from "./useVaultAccounts";
import { isPracticallyZero } from "../utils/math";
import { getAssetDecimals } from "../utils/asset";
import { useGlobalState } from "../store/store";

const localStorageKey = "notificationLastRead";

const useNotifications = () => {
  const { activities: vaultsActivities } = useAllVaultActivities();
  const { data: v2VaultsData } = useV2VaultsData();
  const { data: vaultAccounts } = useAllVaultAccounts();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [lastReadTimestamp, setLastReadTimestamp] = useGlobalState(
    "notificationLastReadTimestamp"
  );

  /**
   * Get last read timestamp
   */
  useEffect(() => {
    let lastRead = localStorage.getItem(localStorageKey);

    if (!lastRead) {
      lastRead = moment().subtract(3, "days").valueOf().toString();
      localStorage.setItem(localStorageKey, lastRead);
    }

    setLastReadTimestamp(parseInt(lastRead));
  }, [setLastReadTimestamp]);

  const updateLastReadTimestamp = useCallback(() => {
    const lastRead = moment().valueOf();

    localStorage.setItem(localStorageKey, lastRead.toString());
    setLastReadTimestamp(lastRead);
  }, [setLastReadTimestamp]);

  /**
   * Process Notification List Item
   */
  useEffect(() => {
    const notificationList: Notification[] = [];

    Object.keys(v2VaultsData).forEach((vaultOption) => {
      const vaultData = v2VaultsData[vaultOption as VaultOptions];

      if (
        !vaultData.withdrawals.amount.isZero() &&
        vaultData.withdrawals.round !== vaultData.round
      ) {
        const lastWithdrawTime = moment()
          .isoWeekday("friday")
          .utc()
          .set("hour", 11)
          .set("minute", 0)
          .set("second", 0)
          .set("millisecond", 0);

        if (lastWithdrawTime.isAfter(moment())) {
          lastWithdrawTime.subtract(1, "week");
        }

        notificationList.push({
          /** Calculate how many weeks prior where the withdrawal happened using withdrawal round */
          date: lastWithdrawTime.subtract(
            vaultData.round - vaultData.withdrawals.round - 1,
            "week"
          ),
          type: "withdrawalReady",
          vault: vaultOption as VaultOptions,
          vaultVersion: "v2",
          amount: vaultData.withdrawals.amount,
        });
      }
    });

    Object.keys(vaultsActivities).forEach((version) => {
      const vaultVersion = version as VaultVersion;
      Object.keys(vaultsActivities[vaultVersion]).forEach((option) => {
        const vaultOption = option as VaultOptions;
        const activities = vaultsActivities[vaultVersion][vaultOption];
        const vaultAccount = vaultAccounts[vaultVersion][vaultOption];

        /**
         * Filter out notification where user do not have position in
         */
        if (
          !vaultAccount ||
          isPracticallyZero(
            vaultAccount.totalBalance,
            getAssetDecimals(getAssets(vaultOption))
          )
        ) {
          return;
        }

        activities.forEach((activity) => {
          switch (activity.type) {
            case "minting":
              notificationList.push({
                date: moment(activity.date),
                type: "optionMinting",
                vault: vaultOption,
                vaultVersion: vaultVersion,
                depositAmount: activity.depositAmount,
                strikePrice: activity.strikePrice,
                openedAt: activity.openedAt,
              });
              break;
            case "sales":
              notificationList.push({
                date: moment(activity.date),
                type: "optionSale",
                vault: vaultOption,
                vaultVersion: vaultVersion,
                sellAmount: activity.sellAmount,
                premium: activity.premium,
                timestamp: activity.timestamp,
              });
          }
        });
      });
    });

    setNotifications(
      notificationList.sort((a, b) => (a.date.isBefore(b.date) ? 1 : -1))
    );
  }, [vaultAccounts, vaultsActivities, v2VaultsData]);

  return {
    notifications,
    lastReadTimestamp,
    updateLastReadTimestamp,
  };
};

export default useNotifications;
