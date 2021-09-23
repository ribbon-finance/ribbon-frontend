import React, { useMemo } from "react";
import styled from "styled-components";

import HeaderLogo from "./HeaderLogo";
import colors from "shared/lib/designSystem/colors";
import sizes from "shared/lib/designSystem/sizes";
import { Title } from "shared/lib/designSystem";
import AccountStatus from "../Wallet/AccountStatus";
import theme from "shared/lib/designSystem/theme";
import { useNFTDropGlobalState } from "../../store/store";

const HeaderContainer = styled.div`
  height: ${theme.header.height}px;
  position: sticky;
  top: 0;
  border-bottom: 1px solid ${colors.border};
  background: rgba(255, 255, 255, 0.01);

  @media (max-width: ${sizes.lg}px) {
    flex-direction: column;
    height: unset;
    padding: 16px 24px;
    border-bottom: none;
  }

  z-index: 10;
`;

const LogoContainer = styled.div`
  padding-left: 40px;
  margin-right: auto;
  z-index: 1000;

  @media (max-width: ${sizes.lg}px) {
    padding-left: 0;
    margin-left: auto;
  }
`;

const DesktopHeaderAbsoluteContainer = styled.div`
  position: absolute;
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;

  @media (max-width: ${sizes.lg}px) {
    display: none;
  }
`;

const MobileInfoContainer = styled.div`
  display: none;

  @media (max-width: ${sizes.lg}px) {
    display: flex;
    margin-top: 48px;
  }
`;

const LinksContainer = styled.div`
  display: flex;
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0px 28px;
  height: 100%;
  opacity: 0.48;

  &:hover {
    opacity: 1;
  }
`;

const NavLinkText = styled(Title)`
  letter-spacing: 1.5px;
  font-size: 14px;
  line-height: 20px;

  @media (max-width: ${sizes.lg}px) {
    font-size: 16px;
    line-height: 24px;
  }
`;

const Header = () => {
  const [, setShowInfoModal] = useNFTDropGlobalState("shwoInfoModal");

  const links = useMemo(
    () => (
      <LinksContainer>
        <NavItem role="button" onClick={() => setShowInfoModal(true)}>
          <NavLinkText>INFO</NavLinkText>
        </NavItem>
      </LinksContainer>
    ),
    [setShowInfoModal]
  );

  return (
    <HeaderContainer className="d-flex align-items-center">
      {/* LOGO */}
      <LogoContainer>
        <HeaderLogo />
      </LogoContainer>

      {/* LINKS */}
      <DesktopHeaderAbsoluteContainer>{links}</DesktopHeaderAbsoluteContainer>

      <MobileInfoContainer>{links}</MobileInfoContainer>

      <AccountStatus variant="desktop" />
    </HeaderContainer>
  );
};

export default Header;
