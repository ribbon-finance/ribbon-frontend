import React, { useState, useRef, useCallback } from "react";
import styled from "styled-components";

import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import useOutsideAlerter from "shared/lib/hooks/useOutsideAlerter";
import useScreenSize from "shared/lib/hooks/useScreenSize";
import sizes from "shared/lib/designSystem/sizes";
import { getAssetLogo } from "shared/lib/utils/asset";
import {
  NETWORK_NAMES,
  ENABLED_NETWORKS,
  NETWORK_TO_NATIVE_TOKENS,
} from "shared/lib/constants/constants";

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.border.radius};
  background: ${colors.background.two};
  height: 48px;
  width: 48px;
  padding: 8px 8px;

  &:hover {
    svg {
      path {
        opacity: ${theme.hover.opacity};
      }
    }
  }
`;

const NetworkSwitcherButton = () => {
  const desktopMenuRef = useRef(null);
  const [show, setShow] = useState(false);
  const [networkIndex, setNetworkIndex] = useState(0);
  const { width } = useScreenSize();
  const networkName: NETWORK_NAMES = ENABLED_NETWORKS[networkIndex];
  const Logo = getAssetLogo(NETWORK_TO_NATIVE_TOKENS[networkName]);

  const handleCloseMenu = useCallback(() => {
    setShow(false);
  }, []);

  useOutsideAlerter(desktopMenuRef, () => {
    if (width > sizes.md && show) handleCloseMenu();
  });

  return (
    <div className="d-flex position-relative" ref={desktopMenuRef}>
      <ButtonContainer
        role="button"
        onClick={() => (show ? handleCloseMenu() : setShow(true))}
      >
        <Logo height={32} width={32}></Logo>
      </ButtonContainer>
    </div>
  );
};

export default NetworkSwitcherButton;
