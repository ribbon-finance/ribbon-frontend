import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";

import Indicator from "../Indicator/Indicator";
import sizes from "../../designSystem/sizes";
import { Title, BaseButton } from "../../designSystem";
import { addConnectEvent } from "../../utils/analytics";
import colors from "../../designSystem/colors";
import {
  WalletStatusProps,
  AccountStatusVariantProps,
  WalletButtonProps,
} from "./types";
import WalletConnectModal from "./WalletConnectModal";
import theme from "../../designSystem/theme";
import MobileOverlayMenu from "../Common/MobileOverlayMenu";
import MenuButton from "../Header/MenuButton";

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

const WalletButtonText = styled(Title)<WalletStatusProps>`
  ${(props) => {
    if (props.connected) return null;

    return `color: ${colors.green}`;
  }}
`;

const WalletMobileOverlayMenu = styled(
  MobileOverlayMenu
)<AccountStatusVariantProps>`
  display: none;

  ${(props) => {
    switch (props.variant) {
      case "mobile":
        return `
        @media (max-width: ${sizes.lg}px) {
          display: flex;
          z-index: ${props.isMenuOpen ? 50 : -1};
        }
        `;
      case "desktop":
        return ``;
    }
  }}
`;

const MenuItem = styled.div`
  padding: 28px;
  opacity: 1;

  &:hover {
    opacity: ${theme.hover.opacity};
  }
`;

const MenuItemText = styled(Title)`
  @media (max-width: ${sizes.md}px) {
    font-size: 24px;
  }
`;

const MenuCloseItem = styled(MenuItem)`
  position: absolute;
  bottom: 50px;
  width: 100%;
  display: flex;
  justify-content: center;
`;

interface AccountStatusProps {
  variant: "desktop" | "mobile";
}

const truncateAddress = (address: string) => {
  return address.slice(0, 6) + "..." + address.slice(address.length - 4);
};

const AccountStatus: React.FC<AccountStatusProps> = ({ variant }) => {
  const {
    deactivate: deactivateWeb3,
    library,
    active,
    account,
  } = useWeb3React();
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleButtonClick = useCallback(async () => {
    if (active) {
      setIsMenuOpen(true);
      return;
    }

    setShowConnectModal(true);
  }, [active]);

  const handleDisconnect = useCallback(async () => {
    deactivateWeb3();
  }, [deactivateWeb3]);

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

  const renderMenuItem = (title: string, onClick?: () => void) => {
    return (
      <MenuItem onClick={onClick} role="button">
        <MenuItemText>{title}</MenuItemText>
      </MenuItem>
    );
  };

  return (
    <>
      <WalletContainer variant={variant}>
        <WalletButton
          variant={variant}
          connected={active}
          role="button"
          onClick={handleButtonClick}
        >
          {renderButtonContent()}
        </WalletButton>
      </WalletContainer>

      <WalletMobileOverlayMenu
        className="flex-column align-items-center justify-content-center"
        isMenuOpen={isMenuOpen}
        onClick={() => setIsMenuOpen(false)}
        variant={variant}
      >
        {renderMenuItem("CHANGE WALLET")}
        {renderMenuItem("COPY ADDRESS")}
        {renderMenuItem("OPEN IN ETHERSCAN")}
        {renderMenuItem("DISCONNECT", handleDisconnect)}
        <MenuCloseItem role="button">
          <MenuButton isOpen={true} onToggle={() => setIsMenuOpen(false)} />
        </MenuCloseItem>
      </WalletMobileOverlayMenu>

      <WalletConnectModal
        show={showConnectModal}
        onClose={() => setShowConnectModal(false)}
      />
    </>
  );
};
export default AccountStatus;
