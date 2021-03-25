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
  MenuStateProps,
} from "./types";
import WalletConnectModal from "./WalletConnectModal";
import theme from "../../designSystem/theme";
import MobileOverlayMenu from "../Common/MobileOverlayMenu";
import MenuButton from "../Header/MenuButton";
import { copyTextToClipboard } from "../../utils/text";
import { Alert } from "react-bootstrap";
import { setTimeout } from "timers";

const AlertFloatingContainer = styled.div`
  display: flex;
  position: absolute;
  width: 100%;
  justify-content: center;
  top: 24px;
  z-index: 100;
`;

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
        position: relative;

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

const WalletButtonArrow = styled.i<MenuStateProps>`
  transition: 0.2s all ease-out;
  transform: ${(props) => (props.isMenuOpen ? "rotate(-180deg)" : "none")};
`;

const WalletDesktopMenu = styled.div<MenuStateProps>`
  ${(props) =>
    props.isMenuOpen
      ? `
          position: absolute;
          right: 40px;
          top: 64px;
          width: fit-content;
          background-color: ${colors.backgroundDarker};
          border-radius: ${theme.border.radius};
        `
      : `
          display: none;
        `}

  @media (max-width: ${sizes.md}px) {
    display: none;
  }
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
  padding: 8px 16px;
  padding-right: 38px;
  opacity: 1;

  &:first-child {
    padding-top: 16px;
  }

  &:last-child {
    padding-bottom: 16px;
  }

  &:hover {
    span {
      color: ${colors.primaryText};
    }
  }

  @media (max-width: ${sizes.md}px) {
    margin: unset;
    padding: 28px;
  }

  @media (max-width: ${sizes.md}px) {
    margin: unset;
    padding: 28px;
  }
`;

const MenuItemText = styled(Title)`
  color: ${colors.primaryText}A3;
  white-space: nowrap;
  @media (max-width: ${sizes.md}px) {
    font-size: 24px;
  }
`;

const MenuCloseItem = styled(MenuItem)`
  position: absolute;
  bottom: 50px;
  left: 0;
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
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (library && account) {
      addConnectEvent("header", account);
    }
  }, [library, account]);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 1500);
      return clearTimeout(timer);
    }
  }, [showToast]);

  const onToggleMenu = useCallback(() => {
    setIsMenuOpen((open) => !open);
  }, []);

  const handleButtonClick = useCallback(async () => {
    if (active) {
      onToggleMenu();
      return;
    }

    setShowConnectModal(true);
  }, [active, onToggleMenu]);

  const onCloseMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleChangeWallet = useCallback(() => {
    setShowConnectModal(true);
    onCloseMenu();
  }, [onCloseMenu]);

  const handleCopyAddress = useCallback(() => {
    if (account) {
      copyTextToClipboard(account);
      setToastMessage(`Address copied!`);
      setShowToast(true);
    }
    onCloseMenu();
  }, [onCloseMenu, account]);

  const handleOpenEtherscan = useCallback(() => {
    if (account) {
      window.open(`https://etherscan.io/address/${account}`);
    }
  }, [account]);

  const handleDisconnect = useCallback(async () => {
    deactivateWeb3();
    onCloseMenu();
  }, [deactivateWeb3, onCloseMenu]);

  const onCloseConnectionModal = useCallback(() => {
    setShowConnectModal(false);
  }, []);

  const renderButtonContent = () =>
    active && account ? (
      <>
        <Indicator connected={active} />
        <WalletButtonText connected={active}>
          {truncateAddress(account)}{" "}
          <WalletButtonArrow
            className="fas fa-chevron-down"
            isMenuOpen={isMenuOpen}
          />
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
      <AlertFloatingContainer>
        <Alert show={showToast} variant="success">
          {toastMessage}
        </Alert>
      </AlertFloatingContainer>
      <WalletContainer variant={variant}>
        <WalletButton
          variant={variant}
          connected={active}
          role="button"
          onClick={handleButtonClick}
        >
          {renderButtonContent()}
        </WalletButton>
        <WalletDesktopMenu isMenuOpen={isMenuOpen}>
          {renderMenuItem("CHANGE WALLET", handleChangeWallet)}
          {renderMenuItem("COPY ADDRESS", handleCopyAddress)}
          {renderMenuItem("OPEN IN ETHERSCAN", handleOpenEtherscan)}
          {renderMenuItem("DISCONNECT", handleDisconnect)}
        </WalletDesktopMenu>
      </WalletContainer>

      <WalletMobileOverlayMenu
        className="flex-column align-items-center justify-content-center"
        isMenuOpen={isMenuOpen}
        onOverlayClick={onCloseMenu}
        variant={variant}
      >
        {renderMenuItem("CHANGE WALLET", handleChangeWallet)}
        {renderMenuItem("COPY ADDRESS", handleCopyAddress)}
        {renderMenuItem("OPEN IN ETHERSCAN", handleOpenEtherscan)}
        {renderMenuItem("DISCONNECT", handleDisconnect)}
        <MenuCloseItem role="button" onClick={onCloseMenu}>
          <MenuButton isOpen={true} onToggle={onCloseMenu} />
        </MenuCloseItem>
      </WalletMobileOverlayMenu>

      <WalletConnectModal
        show={showConnectModal}
        onClose={onCloseConnectionModal}
      />
    </>
  );
};
export default AccountStatus;
