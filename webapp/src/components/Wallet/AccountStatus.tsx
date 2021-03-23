import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";

import Indicator from "../Indicator/Indicator";
import sizes from "../../designSystem/sizes";
import { PrimaryText, BaseButton } from "../../designSystem";
import { addConnectEvent } from "../../utils/analytics";
import colors from "../../designSystem/colors";
import {
  WalletStatusProps,
  AccountStatusVariantProps,
  WalletButtonProps,
} from "./types";
import WalletConnectModal from "./WalletConnectModal";
import theme from "../../designSystem/theme";

const WalletContainer = styled.div<AccountStatusVariantProps>`
  justify-content: center;
  align-items: center;

  ${(props) => {
    switch (props.variant) {
      case "desktop":
        return `
        display: flex;
        padding-right: 40px;
        z-index: 1000;

        @media (max-width: ${sizes.lg}px) {
          display: none;
        }
        `;
      case "mobile":
        return `
          display: none;

          @media (max-width: ${sizes.lg}px) {
            display: flex;
            width: 90%;
            position: absolute;
            bottom: 52px;
            left: 5%;
          }
        `;
    }
  }}
`;

const WalletButton = styled(BaseButton)<WalletButtonProps>`
  background-color: ${(props) =>
    props.connected ? colors.backgroundDarker : `${colors.green}14`};
  align-items: center;

  &:hover {
    opacity: ${theme.hover.opacity};
  }

  ${(props) => {
    switch (props.variant) {
      case "mobile":
        return `
        width: 100%;
        justify-content: center;
      `;
      case "desktop":
        return ``;
    }
  }}
`;

const WalletButtonText = styled(PrimaryText)<WalletStatusProps>`
  ${(props) => {
    if (props.connected) return null;

    return `color: ${colors.green}`;
  }}
`;

interface AccountStatusProps {
  variant: "desktop" | "mobile";
}

const truncateAddress = (address: string) => {
  return address.slice(0, 6) + "..." + address.slice(address.length - 4);
};

const AccountStatus: React.FC<AccountStatusProps> = ({ variant }) => {
  const [showConnectModal, setShowConnectModal] = useState(false);
  const {
    deactivate: deactivateWeb3,
    library,
    active,
    account,
  } = useWeb3React();

  const handleConnect = useCallback(async () => {
    if (active) {
      deactivateWeb3();
      return;
    }

    setShowConnectModal(true);
  }, [active, deactivateWeb3]);

  useEffect(() => {
    if (library && account) {
      addConnectEvent("header", account);
    }
  }, [library, account]);

  const renderButtonContent = () =>
    active && account ? (
      <>
        <Indicator connected={active} />
        <WalletButtonText connected={active}>
          {truncateAddress(account)}
        </WalletButtonText>
      </>
    ) : (
      <WalletButtonText connected={active}>CONNECT WALLET</WalletButtonText>
    );

  return (
    <>
      <WalletContainer variant={variant}>
        <WalletButton
          variant={variant}
          connected={active}
          role="button"
          onClick={handleConnect}
        >
          {renderButtonContent()}
        </WalletButton>
      </WalletContainer>

      <WalletConnectModal
        show={showConnectModal}
        onClose={() => setShowConnectModal(false)}
      />
    </>
  );
};
export default AccountStatus;
