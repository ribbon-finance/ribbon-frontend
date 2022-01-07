import React, { useMemo } from "react";
import styled from "styled-components";
import { useLocation } from "react-router";

import sizes from "shared/lib/designSystem/sizes";
import theme from "shared/lib/designSystem/theme";
import AccountStatus from "../Wallet/AccountStatus";
import DesktopFooter from "./DesktopFooter";

export const FooterContainer = styled.div<{
  showDesktopFooter: boolean;
}>`
  height: ${(props) =>
    props.showDesktopFooter ? theme.footer.desktop.height : 0}px;
  width: 100%;
  display: flex;
  justify-content: center;
  backdrop-filter: blur(40px);
  /**
   * Firefox desktop come with default flag to have backdrop-filter disabled
   * Firefox Android also currently has bug where backdrop-filter is not being applied
   * More info: https://bugzilla.mozilla.org/show_bug.cgi?id=1178765
   **/
  @-moz-document url-prefix() {
    background-color: rgba(0, 0, 0, 0.9);
  }

  @media (max-width: ${sizes.md}px) {
    position: fixed;
    top: unset;
    bottom: 0px;
    height: ${theme.footer.mobile.height}px;
    z-index: 5;
  }
`;

const MobileFooterOffsetContainer = styled.div`
  @media (max-width: ${sizes.md}px) {
    height: ${theme.footer.mobile.height}px;
  }
`;

const Footer = () => {
  const location = useLocation();

  const showDesktopFooter = useMemo(() => {
    switch (location.pathname) {
      case "/":
        return false;
      default:
        return true;
    }
  }, [location.pathname]);

  return (
    <>
      <FooterContainer showDesktopFooter={showDesktopFooter}>
        {/** Desktop */}
        {showDesktopFooter && <DesktopFooter />}

        {/** Mobile */}
        <AccountStatus variant="mobile" />
      </FooterContainer>
      <MobileFooterOffsetContainer />
    </>
  );
};

export default Footer;
