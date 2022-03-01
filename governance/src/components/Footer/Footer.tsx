import React from "react";
import styled from "styled-components";

import sizes from "shared/lib/designSystem/sizes";
import theme from "shared/lib/designSystem/theme";
import AccountStatus from "../Wallet/AccountStatus";
import MobileVeRBNBalance from "../Wallet/MobileVeRBNBalance";

export const FooterContainer = styled.div`
  height: 0px;
  width: 100%;
  display: flex;
  flex-direction: column;
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
    height: ${theme.governance.footer.mobile.height}px;
    z-index: 5;
  }
`;

const MobileFooterOffsetContainer = styled.div`
  @media (max-width: ${sizes.md}px) {
    height: ${theme.governance.footer.mobile.height}px;
  }
`;

const Footer = () => {
  return (
    <>
      <FooterContainer>
        {/** Mobile */}
        <MobileVeRBNBalance />
        <AccountStatus variant="mobile" />
      </FooterContainer>
      <MobileFooterOffsetContainer />
    </>
  );
};

export default Footer;
