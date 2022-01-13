import React, { useState, useRef } from "react";
import styled from "styled-components";

import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import { getAssetLogo } from "shared/lib/utils/asset";
import { CHAINID } from "shared/lib/utils/env";
import { CHAINID_TO_NATIVE_TOKENS } from "shared/lib/constants/constants";
import NetworkSwitcherModal from "./NetworkSwitcherModal";
import { useWeb3Wallet } from "../../hooks/useWeb3Wallet";

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
  const [showModal, setShowModal] = useState(false);
  const { chainId } = useWeb3Wallet();

  const Logo = chainId
    ? getAssetLogo(CHAINID_TO_NATIVE_TOKENS[chainId as CHAINID])
    : () => null;

  return (
    <div className="d-flex position-relative" ref={desktopMenuRef}>
      {chainId && (
        <ButtonContainer role="button" onClick={() => setShowModal(true)}>
          <Logo height={32} width={32}></Logo>
        </ButtonContainer>
      )}

      {/* Since the modal is only shown when button is clicked we just pass in currentChainId=1 */}
      <NetworkSwitcherModal
        show={showModal}
        onClose={() => setShowModal(false)}
        currentChainId={chainId || 1}
      ></NetworkSwitcherModal>
    </div>
  );
};

export default NetworkSwitcherButton;
