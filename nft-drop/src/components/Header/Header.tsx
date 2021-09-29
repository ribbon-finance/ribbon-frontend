import React from "react";
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
  border-bottom: 1px solid ${colors.borderDark};
  background: rgba(255, 255, 255, 0.01);

  z-index: 10;
`;

const LogoContainer = styled.div`
  padding-left: 40px;
  margin-right: auto;
  z-index: 1000;

  @media (max-width: ${sizes.md}px) {
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

  @media (max-width: ${sizes.md}px) {
    display: none;
  }
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
`;

const Header = () => {
  const [, setShowInfoModal] = useNFTDropGlobalState("shwoInfoModal");

  return (
    <HeaderContainer className="d-flex align-items-center">
      {/* LOGO */}
      <LogoContainer>
        <HeaderLogo />
      </LogoContainer>

      {/* LINKS */}
      <DesktopHeaderAbsoluteContainer>
        <NavItem role="button" onClick={() => setShowInfoModal(true)}>
          <NavLinkText>INFO</NavLinkText>
        </NavItem>
      </DesktopHeaderAbsoluteContainer>

      <AccountStatus variant="desktop" />
    </HeaderContainer>
  );
};

export default Header;
