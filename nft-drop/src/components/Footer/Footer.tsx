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
  backdrop-filter: blur(40px);
  background: ${colors.backgroundLight};
  position: fixed;
  bottom: 0px;

  /**
   * Firefox desktop come with default flag to have backdrop-filter disabled
   * Firefox Android also currently has bug where backdrop-filter is not being applied
   * More info: https://bugzilla.mozilla.org/show_bug.cgi?id=1178765
   **/
  @-moz-document url-prefix() {
    background-color: rgba(0, 0, 0, 0.9);
  }

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
