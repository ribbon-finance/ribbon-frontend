import React, { useMemo } from "react";
import { useRouteMatch, useLocation } from "react-router-dom";
import styled from "styled-components";

import sizes from "../../designSystem/sizes";
import theme from "../../designSystem/theme";
import useScreenSize from "../../hooks/useScreenSize";
import AccountStatus from "../Wallet/AccountStatus";
import DesktopFooter from "./DesktopFooter";

const FooterContainer = styled.div<{
  screenHeight: number;
  desktopVariant: "sticky" | "fixed";
}>`
  height: ${theme.footer.desktop.height}px;
  width: 100%;
  display: flex;
  justify-content: center;
  backdrop-filter: blur(40px);
  ${(props) => {
    switch (props.desktopVariant) {
      case "sticky":
        return `
          position: sticky;
          top: calc(${
            props.screenHeight ? `${props.screenHeight}px` : `100%`
          } - ${theme.footer.desktop.height}px);
        `;
      case "fixed":
        return `
        position: fixed;
        bottom: 0px;
        `;
    }
  }}

  @media (max-width: ${sizes.md}px) {
    position: fixed;
    top: unset;
    bottom: 0px;
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
  const matchProductPage = useRouteMatch({ path: "/theta-vault", exact: true });
  const location = useLocation();

  const desktopFooterVariant = useMemo(() => {
    switch (location.pathname) {
      case "/":
        return "fixed";
      default:
        return "sticky";
    }
  }, [location]);

  return (
    <>
      <FooterContainer
        screenHeight={screenHeight}
        desktopVariant={desktopFooterVariant}
      >
        {/** Desktop */}
        <DesktopFooter />

        {/** Mobile */}
        <AccountStatus
          variant="mobile"
          showInvestButton={Boolean(matchProductPage)}
        />
      </FooterContainer>
      <MobileFooterOffsetContainer />
    </>
  );
};

export default Footer;
