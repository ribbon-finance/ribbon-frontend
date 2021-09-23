import React from "react";
import styled from "styled-components";

import sizes from "shared/lib/designSystem/sizes";
import theme from "shared/lib/designSystem/theme";
import AccountStatus from "../Wallet/AccountStatus";
import colors from "shared/lib/designSystem/colors";

const FooterContainer = styled.div`
  display: none;

  @media (max-width: ${sizes.lg}px) {
    display: flex;
    width: 100%;
    position: fixed;
    top: unset;
    bottom: 0px;
    height: ${theme.footer.mobile.height}px;
    z-index: 1;
    background: ${colors.backgroundLight};
  }
`;

const MobileFooterOffsetContainer = styled.div`
  @media (max-width: ${sizes.lg}px) {
    height: ${theme.footer.mobile.height}px;
  }
`;

const Footer = () => (
  <>
    <FooterContainer>
      {/** Mobile */}
      <AccountStatus variant="mobile" />
    </FooterContainer>
    <MobileFooterOffsetContainer />
  </>
);

export default Footer;
