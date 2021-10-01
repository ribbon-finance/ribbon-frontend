import React, { useState, useRef, useCallback } from "react";
import styled from "styled-components";

import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import { BellIcon } from "shared/lib/assets/icons/icons";
import useOutsideAlerter from "shared/lib/hooks/useOutsideAlerter";
import NotificationView from "./NotificationView";
import useScreenSize from "shared/lib/hooks/useScreenSize";
import sizes from "shared/lib/designSystem/sizes";

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.border.radius};
  background: ${colors.backgroundDarker};
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

const NotificationButton = () => {
  const desktopMenuRef = useRef(null);
  const [show, setShow] = useState(false);
  const { width } = useScreenSize();

  const handleCloseMenu = useCallback(() => {
    setShow(false);
  }, []);

  useOutsideAlerter(desktopMenuRef, () => {
    if (width > sizes.md) handleCloseMenu();
  });

  return (
    <div className="d-flex position-relative" ref={desktopMenuRef}>
      <ButtonContainer role="button" onClick={() => setShow((prev) => !prev)}>
        <BellIcon height={16} width={16} />
      </ButtonContainer>
      <NotificationView show={show} onClose={handleCloseMenu} />
    </div>
  );
};

export default NotificationButton;
