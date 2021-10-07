import React from "react";
import styled from "styled-components";

import sizes from "shared/lib/designSystem/sizes";
import theme from "shared/lib/designSystem/theme";
import AccountStatus from "../Wallet/AccountStatus";
import colors from "shared/lib/designSystem/colors";
import DesktopFooter from "./DesktopFooter";
import useScreenSize from "shared/lib/hooks/useScreenSize";

const FooterContainer = styled.div<{
  screenHeight: number;
}>`
  display: flex;
  height: 80px;
  width: 100%;
  justify-content: center;
  background: ${colors.background.two};
  position: fixed;
  bottom: 0px;

  @media (max-width: ${sizes.md}px) {
    height: ${theme.footer.mobile.height}px;
  }
`;

const Footer = () => {
  const { height: screenHeight } = useScreenSize();

  return (
    <>
      <FooterContainer screenHeight={screenHeight}>
        {/** Desktop */}
        <DesktopFooter />

        {/** Mobile */}
        <AccountStatus variant="mobile" />
      </FooterContainer>
    </>
  );
};

export default Footer;
