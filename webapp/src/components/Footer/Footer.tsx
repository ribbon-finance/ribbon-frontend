import React from "react";
import styled from "styled-components";

import sizes from "../../designSystem/sizes";
import useScreenSize from "../../hooks/useScreenSize";
import AccountStatus from "../Wallet/AccountStatus";
import DesktopFooter from "./DesktopFooter";

const FooterContianer = styled.div<{ screenHeight: number }>`
  position: sticky;
  top: ${(props) =>
    props.screenHeight
      ? `calc(${props.screenHeight}px - 52px)`
      : `calc(100vh - 52px)`};
  height: 52px;
  width: 100%;
  display: flex;
  justify-content: center;

  @media (max-width: ${sizes.md}px) {
    position: fixed;
    top: unset;
    bottom: 0px;
    height: 104px;
    backdrop-filter: blur(40px);
  }
`;

const MobileFooterOffsetContainer = styled.div`
  display: none;

  @media (max-width: ${sizes.md}px) {
    display: block;
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
