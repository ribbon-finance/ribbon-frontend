import { useState } from "react";
import styled from "styled-components";

import Logo from "./Logo";
import colors from "../../designSystem/colors";
import sizes from "../../designSystem/sizes";
import { Title, BaseLink } from "../../designSystem";
import MenuButton from "./MenuButton";
import { NavItemProps, MobileMenuOpenProps } from "./types";
import AccountStatus from "../Wallet/AccountStatus";
import theme from "../../designSystem/theme";
import MobileOverlayMenu from "../Common/MobileOverlayMenu";

const HEADER_HEIGHT = 80;

const HeaderContainer = styled.div<MobileMenuOpenProps>`
  height: ${HEADER_HEIGHT}px;
  border-bottom: 1px solid ${colors.border};
  position: relative;

  @media (max-width: ${sizes.md}px) {
    padding: 16px 24px;
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    border-bottom: none;
    background-color: ${colors.background};
  }

  z-index: ${(props) => (props.isMenuOpen ? 50 : 10)};
`;

const LogoContainer = styled.div`
  padding-left: 40px;
  z-index: 1000;

  @media (max-width: ${sizes.md}px) {
    padding-left: 0;
  }
`;

const HeaderAbsoluteContainer = styled.div`
  position: absolute;
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;

  @media (max-width: ${sizes.md}px) {
    display: none;
  }
`;

const LinksContainer = styled.div`
  display: flex;
`;

const NavItem = styled.div<NavItemProps>`
  padding: 28px;
  opacity: ${(props) => (props.isSelected ? "1" : "0.48")};

  &:hover {
    opacity: ${(props) => (props.isSelected ? theme.hover.opacity : "1")};
  }
`;

const NavLinkText = styled(Title)`
  letter-spacing: 1.5px;
  font-size: 14px;
  line-height: 20px;

  @media (max-width: ${sizes.md}px) {
    font-size: 24px;
  }
`;

const MobileOnly = styled.div`
  display: none;

  @media (max-width: ${sizes.md}px) {
    display: flex;
  }
`;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const onToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const renderLinkItem = (title: string, to: string, isSelected: boolean) => {
    return (
      <BaseLink to={to}>
        <NavItem isSelected={isSelected}>
          <NavLinkText>{title}</NavLinkText>
        </NavItem>
      </BaseLink>
    );
  };

  return (
    <HeaderContainer
      isMenuOpen={isMenuOpen}
      className="d-flex align-items-center justify-content-between"
    >
      {/* LOGO */}
      <LogoContainer>
        <Logo></Logo>
      </LogoContainer>

      {/* LINKS */}
      <HeaderAbsoluteContainer>
        <LinksContainer>
          {renderLinkItem("PRODUCTS", "/", true)}
          {renderLinkItem("POSITIONS", "/", false)}
          {renderLinkItem("ABOUT", "/", false)}
        </LinksContainer>
      </HeaderAbsoluteContainer>

      <AccountStatus variant="desktop" />

      {/* MOBILE MENU */}
      <MobileOnly>
        <MenuButton onToggle={onToggleMenu} isOpen={isMenuOpen} />
        <MobileOverlayMenu
          className="flex-column align-items-center justify-content-center"
          isMenuOpen={isMenuOpen}
          onOverlayClick={onToggleMenu}
        >
          {renderLinkItem("PRODUCTS", "/", true)}
          {renderLinkItem("POSITIONS", "/", false)}
          {renderLinkItem("ABOUT", "/", false)}
        </MobileOverlayMenu>
      </MobileOnly>
    </HeaderContainer>
  );
};

export default Header;
