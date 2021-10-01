import React from "react";
import styled from "styled-components";

import useNotifications from "shared/lib/hooks/useNotifications";
import {
  BaseLink,
  PrimaryText,
  Subtitle,
  Title,
} from "shared/lib/designSystem";
import {
  getAssetDecimals,
  getAssetDisplay,
  getAssetLogo,
} from "shared/lib/utils/asset";
import { getAssets, getDisplayAssets } from "shared/lib/constants/constants";
import colors from "shared/lib/designSystem/colors";
import { useCallback } from "react";
import { Notification } from "shared/lib/models/notification";
import { formatBigNumber, formatOption } from "shared/lib/utils/math";
import { getVaultColor } from "shared/lib/utils/vault";
import { productCopies } from "shared/lib/components/Product/productCopies";
import { getVaultURI } from "../../constants/constants";
import { useHistory } from "react-router-dom";

const NotificationItems = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-grow: 1;
  overflow: auto;
  align-content: start;

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

const NotificationItem = styled.div`
  display: flex;
  padding: 16px;

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
}

const NotificationList: React.FC<NotificationListProps> = ({ onClose }) => {
  const notifications = useNotifications();
  const history = useHistory();

  const renderNotificationInfo = useCallback((notification: Notification) => {
    const asset = getAssets(notification.vault);
    const decimals = getAssetDecimals(asset);
    const color = getVaultColor(notification.vault);

    const badge = (
      <NotificationItemVaultPill color={color} className="ml-2">
        <Subtitle fontSize={10} lineHeight={12} color={color}>
          {productCopies[notification.vault].title}
        </Subtitle>
      </NotificationItemVaultPill>
    );

    switch (notification.type) {
      case "optionMinting":
        return (
          <>
            <div className="d-flex align-items-center">
              <Title fontSize={14} lineHeight={24}>
                MINTED OPTIONS
              </Title>
              {badge}
            </div>
            <PrimaryText
              fontSize={12}
              lineHeight={16}
              color={colors.text}
              className="mt-1"
            >
              The vault minted{" "}
              {formatBigNumber(notification.depositAmount, decimals)} options at
              a strike price of $
              {formatOption(notification.strikePrice).toLocaleString()}
            </PrimaryText>
          </>
        );
      case "optionSale":
        return (
          <>
            <div className="d-flex align-items-center">
              <Title fontSize={14} lineHeight={24}>
                SOLD OPTIONS
              </Title>
              {badge}
            </div>
            <PrimaryText
              fontSize={12}
              lineHeight={16}
              color={colors.text}
              className="mt-1"
            >
              The vault sold{" "}
              {formatOption(notification.sellAmount).toLocaleString()} options
              for {formatBigNumber(notification.premium, decimals)}{" "}
              {getAssetDisplay(asset)}
            </PrimaryText>
          </>
        );
      case "withdrawalReady":
        return (
          <>
            <div className="d-flex align-items-center">
              <Title fontSize={14} lineHeight={24}>
                WITHDRAWALS READY
              </Title>
              {badge}
            </div>
            <PrimaryText
              fontSize={12}
              lineHeight={16}
              color={colors.text}
              className="mt-1"
            >
              Your initiated withdrawals of{" "}
              {formatBigNumber(notification.amount, decimals)}{" "}
              {getAssetDisplay(asset)} are now ready to withdraw from the vault
            </PrimaryText>
          </>
        );
    }
  }, []);

  return notifications.length > 0 ? (
    <NotificationItems>
      {notifications.map((notification) => {
        const Logo = getAssetLogo(getDisplayAssets(notification.vault));

        return (
          <NotificationItem
            role="button"
            onClick={() => {
              onClose();
              history.push(
                getVaultURI(notification.vault, notification.vaultVersion)
              );
            }}
          >
            <NotificationItemIcon>
              <Logo />
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
          </NotificationItem>
        );
      })}
    </NotificationItems>
  ) : (
    <div className="d-flex h-100 align-items-center justify-content-center">
      <PrimaryText fontSize={14} lineHeight={20}>
        You have no notifications
      </PrimaryText>
    </div>
  );
};

export default NotificationList;
