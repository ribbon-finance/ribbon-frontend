import { useState } from "react";
import styled from "styled-components";

import Logo from "./Logo";
import colors from "../../designSystem/colors";
import { mobileWidth } from "../../designSystem/sizes";
import { PrimaryText, BaseLink } from "../../designSystem";
import MenuButton from "./MenuButton";
import { NavItemProps, MobileOverlayMenuProps } from "./types";
import AccountStatus from "./AccountStatus";

const HEADER_HEIGHT = 80;

const HeaderContainer = styled.div`
  height: ${HEADER_HEIGHT}px;
  border-bottom: 1px solid ${colors.border};
  position: relative;

  @media (max-width: ${mobileWidth}px) {
    padding: 16px 24px;
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    border-bottom: none;
    background-color: ${colors.background};
  }
`;

const NavLinkText = styled(PrimaryText)`
  letter-spacing: 1.5px;
`;

const LogoContainer = styled.div`
  padding-left: 40px;
  z-index: 1000;

  @media (max-width: ${mobileWidth}px) {
    padding-left: 0;
  }
`;

const HeaderAbsoluteContainer = styled.div`
  position: absolute;
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;

  @media (max-width: ${mobileWidth}px) {
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
    opacity: ${(props) => (props.isSelected ? "0.85" : "1")};
  }
`;

const MobileOnly = styled.div`
  display: none;

  @media (max-width: ${mobileWidth}px) {
    display: flex;
  }
`;

const MobileOverlayMenu = styled.div<MobileOverlayMenuProps>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 100vh;
  z-index: -1;
  backdrop-filter: blur(80px);
  transition: 0.1s all ease-in;

  ${(props) =>
    props.isMenuOpen
      ? `
    opacity: 1;
  `
      : `
    opacity: 0;
    visibility: hidden;
  `}
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
    <HeaderContainer className="d-flex align-items-center justify-content-between">
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

      <AccountStatus />

      {/* MOBILE MENU */}
      <MobileOnly>
        <MenuButton onToggle={onToggleMenu} isOpen={isMenuOpen} />
        <MobileOverlayMenu
          onClick={() => console.log("oopsie do")}
          className="d-flex flex-column align-items-center justify-content-center"
          isMenuOpen={isMenuOpen}
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
