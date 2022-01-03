import React from "react";
import styled from "styled-components";

import sizes from "shared/lib/designSystem/sizes";
import theme from "shared/lib/designSystem/theme";
import AccountStatus from "../Wallet/AccountStatus";
import DesktopFooter from "./DesktopFooter";
import useScreenSize from "shared/lib/hooks/useScreenSize";

const FooterContainer = styled.div<{
  screenHeight: number;
}>`
  height: ${theme.footer.desktop.height}px;
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

  ${(props) => `
    position: sticky;
    top: calc(${props.screenHeight ? `${props.screenHeight}px` : `100%`} - ${
    theme.footer.desktop.height
  }px);
  `}

  @media (max-width: ${sizes.md}px) {
    position: fixed;
    top: unset;
    bottom: 0px;
    height: ${theme.footer.mobile.height}px;
    z-index: 5;
  }
`;

const MobileFooterOffsetContainer = styled.div<{ showActionBar: boolean }>`
  @media (max-width: ${sizes.md}px) {
    height: ${(props) =>
      theme.footer.mobile.height +
      (props.showActionBar ? theme.governance.actionBar.height : 0)}px;
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
      <MobileFooterOffsetContainer showActionBar={false} />
    </>
  );
};

export default Footer;
