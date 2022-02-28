import React, { useState, useRef, useCallback } from "react";
import styled from "styled-components";

import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import { BellIcon } from "shared/lib/assets/icons/icons";
import useOutsideAlerter from "shared/lib/hooks/useOutsideAlerter";
import NotificationView from "./NotificationView";
import useScreenSize from "shared/lib/hooks/useScreenSize";
import sizes from "shared/lib/designSystem/sizes";
import useNotifications from "shared/lib/hooks/useNotifications";
import HeaderButtonContainer from "shared/lib/components/Common/HeaderButtonContainer";

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  width: 48px;

  &:hover {
    svg {
      path {
        opacity: ${theme.hover.opacity};
      }
    }
  }
`;

const UnreadIndicator = styled.div`
  position: absolute;
  top: 13px;
  right: 13px;
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background: ${colors.red};
`;

const NotificationButton = () => {
  const desktopMenuRef = useRef(null);
  const [show, setShow] = useState(false);
  const { width } = useScreenSize();

  const { notifications, lastReadTimestamp, updateLastReadTimestamp } =
    useNotifications();

  const handleCloseMenu = useCallback(() => {
    setShow(false);
    updateLastReadTimestamp();
  }, [updateLastReadTimestamp]);

  useOutsideAlerter(desktopMenuRef, () => {
    if (width > sizes.md && show) handleCloseMenu();
  });

  return (
    <HeaderButtonContainer containerRef={desktopMenuRef}>
      <ButtonContainer
        role="button"
        onClick={() => (show ? handleCloseMenu() : setShow(true))}
      >
        <BellIcon height={16} width={16} />
        {notifications.find(
          (notification) =>
            lastReadTimestamp &&
            lastReadTimestamp <= notification.date.valueOf()
        ) && <UnreadIndicator />}
      </ButtonContainer>
      <NotificationView show={show} onClose={handleCloseMenu} />
    </HeaderButtonContainer>
  );
};

export default NotificationButton;
