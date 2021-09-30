import { useEffect, useState } from "react";
import moment from "moment";

import { VaultOptions, VaultVersion } from "../constants/constants";
import { Notification } from "../models/notification";
import { useAllVaultActivities } from "./useVaultActivity";
import { useV2VaultsData } from "./vaultDataContext";

const useNotifications = () => {
  const { activities: vaultsActivities } = useAllVaultActivities();
  const { data: v2VaultsData } = useV2VaultsData();

  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const notificationList: Notification[] = [];

    Object.keys(v2VaultsData).forEach((vaultOption) => {
      const vaultData = v2VaultsData[vaultOption as VaultOptions];

      if (
        !vaultData.withdrawals.amount.isZero() &&
        vaultData.withdrawals.round !== vaultData.round
      ) {
        notificationList.push({
          date: moment(),
          type: "withdrawalReady",
          vault: vaultOption as VaultOptions,
          amount: vaultData.withdrawals.amount,
        });
      }
    });

    Object.keys(vaultsActivities).forEach((version) => {
      Object.keys(vaultsActivities[version as VaultVersion]).forEach(
        (option) => {
          const activities =
            vaultsActivities[version as VaultVersion][option as VaultOptions];

          activities.forEach((activity) => {
            switch (activity.type) {
              case "minting":
                notificationList.push({
                  date: moment(activity.date),
                  type: "optionMinting",
                  vault: option as VaultOptions,
                  vaultVersion: version as VaultVersion,
                  mintAmount: activity.mintAmount,
                  strikePrice: activity.strikePrice,
                  openedAt: activity.openedAt,
                });
                break;
              case "sales":
                notificationList.push({
                  date: moment(activity.date),
                  type: "optionSale",
                  vault: option as VaultOptions,
                  vaultVersion: version as VaultVersion,
                  sellAmount: activity.sellAmount,
                  premium: activity.premium,
                  timestamp: activity.timestamp,
                });
            }
          });
        }
      );
    });

    setNotifications(
      notificationList.sort((a, b) => (a.date.isAfter(b.date) ? 1 : -1))
    );
  }, [vaultsActivities, v2VaultsData]);

  return notifications;
};

export default useNotifications;
