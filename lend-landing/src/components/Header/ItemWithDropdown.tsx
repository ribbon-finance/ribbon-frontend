import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { setTimeout } from "timers";

import sizes from "../../designSystem/sizes";
import { Title, BaseButton } from "../../designSystem";
import colors from "shared/lib/designSystem/colors";
import {
  WalletStatusProps,
  AccountStatusVariantProps,
  WalletButtonProps,
  MenuStateProps,
} from "./types";
import theme from "../../designSystem/theme";
import MobileOverlayMenu from "shared/lib/components/Common/MobileOverlayMenu";
import MenuButton from "./MenuButton";
import useOutsideAlerter from "../../hooks/useOutsideAlerter";
import ButtonArrow from "../Common/ButtonArrow";

const WalletContainer = styled.div<AccountStatusVariantProps>`
  justify-content: center;
  align-items: center;
  height: 100%;
  width: fit-content;
  display: flex;
  z-index: 1000;
  position: relative;

  @media (max-width: ${sizes.md}px) {
    display: none;
  }
`;

const WalletButton = styled(BaseButton)<WalletButtonProps>`
  align-items: center;
  height: fit-content;
  opacity: ${(props) => (props.isMenuOpen ? "1" : "0.48")};

  &:hover {
    opacity: 1;
  }
`;

const WalletButtonText = styled(Title)<WalletStatusProps>`
  font-size: 14px;
  line-height: 20px;

  @media (max-width: ${sizes.md}px) {
    font-size: 16px;
  }

  @media (max-width: 350px) {
    font-size: 13px;
  }
`;

const WalletDesktopMenu = styled.div<MenuStateProps>`
  ${(props) =>
    props.isMenuOpen
      ? `
            position: absolute;
            right: 40px;
            top: 64px;
            width: fit-content;
            background-color: ${colors.background.two};
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
            @media (max-width: ${sizes.md}px) {
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
  opacity: 1;
  display: flex;
  align-items: center;
  color: ${colors.primaryText};
  background: green;

  &:first-child {
    padding-top: 16px;
  }

  &:last-child {
    padding-bottom: 16px;
  }

  &:hover {
    span {
      // color: ${colors.primaryText};
    }
  }
`;

const MenuItemText = styled(Title)`
  color: ${colors.primaryText}A3;
  white-space: nowrap;
  font-size: 14px;
  line-height: 20px;

  @media (max-width: ${sizes.md}px) {
    font-size: 24px;
  }

  &:hover {
    color: ${colors.primaryText};
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

interface DropdownItem {
  link: string;
  text: string;
}

interface ItemWithDropdownProps {
  variant: "desktop" | "mobile";
  dropdownItems: DropdownItem[];
}

const ItemWithDropdown: React.FC<ItemWithDropdownProps> = ({
  variant,
  children,
  dropdownItems,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copyState, setCopyState] = useState<"visible" | "hiding" | "hidden">(
    "hidden"
  );

  // Track clicked area outside of desktop menu
  const desktopMenuRef = useRef(null);
  useOutsideAlerter(desktopMenuRef, () => {
    if (variant === "desktop" && isMenuOpen) onCloseMenu();
  });

  useEffect(() => {
    let timer;

    switch (copyState) {
      case "visible":
        timer = setTimeout(() => {
          setCopyState("hiding");
        }, 800);
        break;
      case "hiding":
        timer = setTimeout(() => {
          setCopyState("hidden");
        }, 200);
    }

    if (timer) clearTimeout(timer);
  }, [copyState]);

  const onToggleMenu = useCallback(() => {
    setIsMenuOpen((open) => !open);
  }, []);

  const onCloseMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const renderMenuItem = (
    index: number,
    title: string,
    link: string,
    extra?: React.ReactNode
  ) => {
    return (
      <a key={index} href={link} target="_blank" rel="noreferrer noopener">
        <MenuItem role="button">
          <MenuItemText>{title}</MenuItemText>
          {extra}
        </MenuItem>
      </a>
    );
  };

  return (
    <>
      {/* Main Button and Desktop Menu */}
      <WalletContainer variant={variant} ref={desktopMenuRef}>
        <WalletButton
          isMenuOpen={isMenuOpen}
          variant={variant}
          role="button"
          onClick={onToggleMenu}
        >
          <>
            <WalletButtonText>{children}</WalletButtonText>
          </>
        </WalletButton>
      </WalletContainer>
    </>
  );
};
export default ItemWithDropdown;
