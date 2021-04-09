import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { setTimeout } from "timers";

import sizes from "../../designSystem/sizes";
import { Title, BaseButton } from "../../designSystem";
import colors from "../../designSystem/colors";
import {
  WalletStatusProps,
  AccountStatusVariantProps,
  WalletButtonProps,
  MenuStateProps,
} from "./types";
import theme from "../../designSystem/theme";
import MobileOverlayMenu from "../Common/MobileOverlayMenu";
import MenuButton from "./MenuButton";
import useOutsideAlerter from "../../hooks/useOutsideAlerter";
import ButtonArrow from "../Common/ButtonArrow";

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
  
          @media (max-width: ${sizes.md}px) {
            display: none;
          }
          `;
      case "mobile":
        return `
            display: none;
  
            @media (max-width: ${sizes.md}px) {
              display: flex;
              align-items: unset;
              padding-top: 16px;
              width: 100%;
            }
          `;
    }
  }}
`;

const WalletButton = styled(BaseButton)<WalletButtonProps>`
  align-items: center;
  height: fit-content;
  opacity: ${(props) => (props.isMenuOpen ? "1" : "0.48")};

  &:hover {
    opacity: 1;
  }

  ${(props) => {
    switch (props.variant) {
      case "mobile":
        return `
          height: 48px;
          justify-content: center;
          padding: 14px 16px;
        `;
      case "desktop":
        return ``;
    }
  }}
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
  padding-right: 38px;
  opacity: 1;
  display: flex;
  align-items: center;
  color: ${colors.primaryText};

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

  @media (max-width: ${sizes.md}px) {
    margin: unset;
    && {
      padding: 28px;
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
            <WalletButtonText>
              {children} <ButtonArrow isOpen={isMenuOpen} />
            </WalletButtonText>
          </>
        </WalletButton>
        <WalletDesktopMenu isMenuOpen={isMenuOpen}>
          {dropdownItems.map((item, index) =>
            renderMenuItem(index, item.text, item.link)
          )}
        </WalletDesktopMenu>
      </WalletContainer>

      {/* Mobile Menu */}
      <WalletMobileOverlayMenu
        className="flex-column align-items-center justify-content-center"
        isMenuOpen={isMenuOpen}
        onClick={onCloseMenu}
        variant={variant}
        mountRoot="div#root"
        overflowOnOpen={false}
      >
        {dropdownItems.map((item, index) =>
          renderMenuItem(index, item.text, item.link)
        )}

        <MenuCloseItem role="button" onClick={onCloseMenu}>
          <MenuButton isOpen={true} onToggle={onCloseMenu} />
        </MenuCloseItem>
      </WalletMobileOverlayMenu>
    </>
  );
};
export default ItemWithDropdown;
