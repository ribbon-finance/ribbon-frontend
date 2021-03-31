import React from "react";
import styled from "styled-components";

import sizes from "../../designSystem/sizes";
import theme from "../../designSystem/theme";
import useScreenSize from "../../hooks/useScreenSize";
import AccountStatus from "../Wallet/AccountStatus";
import DesktopFooter from "./DesktopFooter";

const FooterContianer = styled.div<{ screenHeight: number }>`
  position: fixed;
  bottom: 0px;
  height: ${theme.footer.desktop.height}px;
  width: 100%;
  display: flex;
  justify-content: center;
  backdrop-filter: blur(40px);

  @media (max-width: ${sizes.md}px) {
    height: ${theme.footer.mobile.height}px;
  }
`;

const MobileFooterOffsetContainer = styled.div`
  height: ${theme.footer.desktop.height}px;

  @media (max-width: ${sizes.md}px) {
    height: ${theme.footer.mobile.height}px;
  }
`;

const Footer = () => {
  const { height: screenHeight } = useScreenSize();
  return (
    <>
      <FooterContianer screenHeight={screenHeight}>
        {/** Desktop */}
        <DesktopFooter />

        {/** Mobile */}
        <AccountStatus variant="mobile" />
      </FooterContianer>
      <MobileFooterOffsetContainer />
    </>
  );
};

export default Footer;
