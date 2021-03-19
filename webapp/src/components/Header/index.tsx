import Logo from "./Logo";
import colors from "../../designSystem/colors";
import { mobileWidth } from "../../designSystem/sizes";
import { BaseText } from "../../designSystem";
import Indicator from "../Indicator/Indicator";
import MenuButton from "./MenuButton";

import styled from "styled-components";
import { Link } from "react-router-dom";
import { useState } from "react";

const HEADER_HEIGHT = 80;

const HeaderContainer = styled.div`
  height: ${HEADER_HEIGHT}px;
	border-bottom: 1px solid ${colors.border};

  @media (max-width: ${mobileWidth}px) {
    padding: 16px 24px;
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    border-bottom: none;
    background-color: ${colors.background}
  }
`;

const LinkText = styled(BaseText)`
	font-family: VCR;
  font-weight: 500;
  font-size: 16px;
  color: white;

  @media (max-width: ${mobileWidth}px) {
    font-size: 24px;
  }
`

const LogoContainer = styled.div`
  padding-left: 40px;

  @media (max-width: ${mobileWidth}px) {
    padding-left: 0;
  }
`
const LinksContainer = styled.div`
  display: flex;
  
  @media (max-width: ${mobileWidth}px) {
    display: none;
  }
`

const VerticalSeparator = styled.div`
	border-left: 1px solid ${colors.border};
`

const NavItem = styled.div`
	padding: 28px;
	opacity: 0.48;
`

const WalletContainer = styled(VerticalSeparator)`
  display: flex;
  justify-content: center;
  align-items: center;
	padding: 28px;

  @media (max-width: ${mobileWidth}px) {
    display: none;
  }
`

const MobileOnly = styled.div`
  @media (min-width: ${mobileWidth}px) {
    display: none;
  }
`

const MobileOverlayMenu = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 100vh;
  z-index: -1;
  backdrop-filter: blur(80px);
  transition: 0.1s all ease-in;
`

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const onToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const renderLinkItem = (title: string, to: string, isSelected: boolean) => {
    const itemStyle = {
      opacity: isSelected ? 1 : 0.48
    }
    return (
      <Link to={to}>
        <NavItem style={itemStyle}>
          <LinkText>{title}</LinkText>
        </NavItem>
      </Link>
    )
  }

  // TODO: - Change to actual wallet status
  const walletConnected = true
  const mobileOverlayStyle: React.CSSProperties = isMenuOpen
    ? {
      opacity: 1
    }
    : {
      visibility: 'hidden',
      opacity: 0
    }

  return (
    <HeaderContainer className="d-flex align-items-center justify-content-between">
      {/* LOGO */}
      <LogoContainer>
        <Logo></Logo>
      </LogoContainer>

      {/* LINKS */}
      <LinksContainer>
        <VerticalSeparator />
        {renderLinkItem('PRODUCTS', '/', true)}
        <VerticalSeparator />
        {renderLinkItem('POSITIONS', '/', false)}
        <VerticalSeparator />
        {renderLinkItem('ABOUT', '/', false)}
        <VerticalSeparator />
      </LinksContainer>

      {/* WALLET */}
      <WalletContainer>
        <Indicator connected={walletConnected} />
        <LinkText>0x573B...	C65F</LinkText>
      </WalletContainer>

      {/* MOBILE MENU */}
      <MobileOnly>
        <MenuButton onToggle={onToggleMenu} isOpen={isMenuOpen} />
        <MobileOverlayMenu
          onClick={() => console.log('oopsie do')}
          className="d-flex flex-column align-items-center justify-content-center"
          style={mobileOverlayStyle}
        >
          {renderLinkItem('PRODUCTS', '/', true)}
          {renderLinkItem('POSITIONS', '/', false)}
          {renderLinkItem('ABOUT', '/', false)}
        </MobileOverlayMenu>
      </MobileOnly>
    </HeaderContainer>
  );
};

export default Header;
