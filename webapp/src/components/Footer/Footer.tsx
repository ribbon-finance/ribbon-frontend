import React from "react";
import styled from "styled-components";

import sizes from "../../designSystem/sizes";
import useScreenSize from "../../hooks/useScreenSize";
import AccountStatus from "../Wallet/AccountStatus";
import DesktopFooter from "./DesktopFooter";

const FooterContianer = styled.div<{ screenHeight: number }>`
  position: fixed;
  bottom: 0px;
  height: 52px;
  width: 100%;
  display: flex;
  justify-content: center;
  backdrop-filter: blur(40px);

  @media (max-width: ${sizes.md}px) {
    height: 104px;
  }
`;

const MobileFooterOffsetContainer = styled.div`
  height: 52px;

  @media (max-width: ${sizes.md}px) {
    height: 104px;
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
