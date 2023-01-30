import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { motion } from "framer";
import { useTranslation } from "react-i18next";

import useNotifications from "../../hooks/useNotifications";
import { PrimaryText, Subtitle, Title } from "shared/lib/designSystem";
import {
  getAssetDecimals,
  getAssetDisplay,
  getAssetLogo,
} from "shared/lib/utils/asset";
import {
  getAssets,
  getDisplayAssets,
  VaultOptions,
} from "shared/lib/constants/constants";
import colors from "shared/lib/designSystem/colors";
import { useCallback } from "react";
import { Notification, NotificationType } from "../../models/notification";
import { formatBigNumber, formatOption } from "shared/lib/utils/math";
import { getVaultColor } from "shared/lib/utils/vault";
import { getVaultURI } from "../../constants/constants";
import theme from "shared/lib/designSystem/theme";
import SegmentControl from "shared/lib/components/Common/SegmentControl";

const VaultFilterSection = styled.div`
  border-bottom: ${theme.border.width} ${theme.border.style} ${colors.border};
  position: relative;
`;

const ColorDot = styled.div<{ color: string }>`
  height: 6px;
  width: 6px;
  border-radius: 3px;
  background: ${(props) => props.color};
`;

const NotificationItems = styled.ul`
  display: flex;
  flex-wrap: wrap;
  flex-grow: 1;
  overflow: auto;
  align-content: start;

  /* List specific css */
  padding-inline-start: 0;
  list-style-type: none;
  margin-block-end: 0px;
  margin-block-start: 0px;

  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: #ffffff3d transparent;

  /* Chrome, Edge, and Safari */
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ffffff3d;
    border-radius: 12px;
  }
`;

const NotificationItem = styled(motion.li)`
  display: flex;
  padding: 16px;
  width: 100%;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
  }
`;

const NotificationItemIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 40px;
`;

const NotificationItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 249px;
`;

const NotificationItemVaultPill = styled.div<{ color: string }>`
  display: flex;
  padding: 4px 8px;
  background: ${(props) => props.color}29;
  border-radius: 100px;
`;

interface NotificationListProps {
  onClose: () => void;
  filters: NotificationType[];
}

const NotificationList: React.FC<NotificationListProps> = ({
  onClose,
  filters,
}) => {
  const { notifications, lastReadTimestamp } = useNotifications();
  const history = useHistory();
  const { t } = useTranslation();

  const [notificationVaultFilter, setNotificationVaultFilter] = useState<
    VaultOptions | "all"
  >("all");

  const typeFilteredNotifications = useMemo(
    () =>
      notifications.filter((notification) =>
        filters.includes(notification.type)
      ),
    [filters, notifications]
  );

  const notificationsVaultList = useMemo(
    () =>
      Array.from(
        new Set(
          typeFilteredNotifications.map((notification) => notification.vault)
        )
      ),
    [typeFilteredNotifications]
  );

  /**
   * Ensure empty list does not happen
   */
  useEffect(() => {
    if (
      notificationVaultFilter !== "all" &&
      !notificationsVaultList.includes(notificationVaultFilter)
    ) {
      setNotificationVaultFilter("all");
    }
  }, [notificationVaultFilter, notificationsVaultList]);

  const filteredNotifications = useMemo(
    () =>
      typeFilteredNotifications.filter(
        (notification) =>
          notificationVaultFilter === "all" ||
          notification.vault === notificationVaultFilter
      ),
    [notificationVaultFilter, typeFilteredNotifications]
  );

  const renderNotificationInfo = useCallback(
    (notification: Notification) => {
      const asset = getAssets(notification.vault);
      const decimals = getAssetDecimals(asset);
      const color = getVaultColor(notification.vault);

      const badge = (
        <NotificationItemVaultPill color={color} className="ml-2">
          <Subtitle fontSize={10} lineHeight={12} color={color}>
            {t(`shared:ProductCopies:${notification.vault}:title`)}
          </Subtitle>
        </NotificationItemVaultPill>
      );

      let title: string;
      let body: JSX.Element;
      const premiumDecimals = getAssetDecimals("USDC");
      switch (notification.type) {
        case "optionMinting":
          title = "MINTED OPTIONS";
          body = (
            <>
              The vault minted{" "}
              {formatBigNumber(notification.depositAmount, decimals)} options at
              a strike price of $
              {formatOption(notification.strikePrice).toLocaleString()}
            </>
          );
          break;
        case "optionSale":
          title = "SOLD OPTIONS";
          body = (
            <>
              The vault sold{" "}
              {formatOption(notification.sellAmount).toLocaleString()} options
              for {formatBigNumber(notification.premium, premiumDecimals)}{" "}
              {getAssetDisplay("USDC")}
            </>
          );
          break;
        case "withdrawalReady":
          title = "WITHDRAWALS READY";
          body = (
            <>
              Your initiated withdrawals of{" "}
              {formatBigNumber(notification.amount, decimals)}{" "}
              {getAssetDisplay(asset)} are now ready to withdraw from the vault
            </>
          );
          break;
        case "distributePremium":
          title = "PREMIUM DISTRIBUTION";

          body = (
            <>
              The vault transferred{" "}
              {formatBigNumber(notification.amount, premiumDecimals)}{" "}
              {getAssetDisplay("USDC")} to your address
            </>
          );
      }

      return (
        <>
          <div className="d-flex align-items-center">
            <Title fontSize={14} lineHeight={24}>
              {title}
            </Title>
            {badge}
          </div>
          <PrimaryText
            fontSize={12}
            lineHeight={16}
            color={colors.text}
            className="mt-1"
          >
            {body}
          </PrimaryText>
        </>
      );
    },
    [t]
  );

  const getNotificationRedirectQuerystring = useCallback(
    (notification: Notification) => {
      switch (notification.type) {
        case "withdrawalReady":
          return `?initialAction=completeWithdraw`;
        case "optionMinting":
        case "optionSale":
          return `?jumpTo=vaultActivity&activityTimestamp=${notification.date.valueOf()}`;
        case "distributePremium":
          return "";
      }
    },
    []
  );

  return filteredNotifications.length > 0 ? (
    <>
      {notificationsVaultList.length > 1 && (
        <VaultFilterSection>
          <SegmentControl
            segments={[
              { value: "all", display: "ALL" as string | JSX.Element },
            ].concat(
              notificationsVaultList.map((vault) => {
                const showColorDot = typeFilteredNotifications.find(
                  (notification) =>
                    notification.vault === vault &&
                    lastReadTimestamp &&
                    lastReadTimestamp <= notification.date.valueOf()
                );

                return {
                  value: vault,
                  display: (
                    <span className="d-flex align-items-center">
                      {showColorDot && (
                        <ColorDot
                          color={getVaultColor(vault)}
                          className="mr-2"
                        />
                      )}
                      <Title
                        color={getVaultColor(vault)}
                        fontSize={14}
                        lineHeight={24}
                      >
                        {t(`shared:ProductCopies:${vault}:title`)}
                      </Title>
                    </span>
                  ),
                };
              })
            )}
            value={notificationVaultFilter}
            onSelect={(value) =>
              setNotificationVaultFilter(value as VaultOptions)
            }
          />
        </VaultFilterSection>
      )}
      <NotificationItems>
        {filteredNotifications.map((notification) => {
          const Logo =
            notification.type !== "distributePremium"
              ? getAssetLogo(getDisplayAssets(notification.vault))
              : getAssetLogo("USDC");

          return (
            <NotificationItem
              key={notification.vault + notification.date.valueOf().toString()}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.4,
                type: "keyframes",
                ease: "easeOut",
              }}
              role="button"
              onClick={() => {
                onClose();
                notification.type !== "distributePremium"
                  ? history.push(
                      getVaultURI(
                        notification.vault,
                        notification.vaultVersion
                      ) + getNotificationRedirectQuerystring(notification)
                    )
                  : history.push("/portfolio");
              }}
            >
              <NotificationItemIcon>
                <Logo height={40} width={40} />
              </NotificationItemIcon>
              <NotificationItemInfo className="ml-2">
                {renderNotificationInfo(notification)}
                <PrimaryText
                  fontSize={12}
                  lineHeight={16}
                  className="mt-3"
                  style={{ opacity: 0.4 }}
                >
                  {notification.date.fromNow()}
                </PrimaryText>
              </NotificationItemInfo>
              {lastReadTimestamp &&
                lastReadTimestamp <= notification.date.valueOf() && (
                  <div className="d-flex h-100 align-items-center ml-auto">
                    <ColorDot color={getVaultColor(notification.vault)} />
                  </div>
                )}
            </NotificationItem>
          );
        })}
      </NotificationItems>
    </>
  ) : (
    <div className="d-flex h-100 align-items-center justify-content-center">
      <PrimaryText fontSize={14} lineHeight={20}>
        You have no notifications
      </PrimaryText>
    </div>
  );
};

export default NotificationList;
