import { useState } from "react";
import styled from "styled-components";
import { useRouteMatch } from "react-router-dom";

import HeaderLogo from "./HeaderLogo";
import colors from "shared/lib/designSystem/colors";
import sizes from "shared/lib/designSystem/sizes";
import { Title, BaseLink } from "shared/lib/designSystem";
import MenuButton from "shared/lib/components/Common/MenuButton";
import { NavItemProps, MobileMenuOpenProps } from "./types";
import AccountStatus from "../Wallet/AccountStatus";
import theme from "shared/lib/designSystem/theme";
import MobileOverlayMenu from "shared/lib/components/Common/MobileOverlayMenu";
import DesktopSubmenu from "./DesktopSubmenu";

// Close button for temp banner
const CloseButton = styled.div`
  position: absolute;
  right: 8px;
  padding-top: 3px;
`;

const TempLMBanner = styled.div.attrs({
  className: "d-flex align-items-center justify-content-center",
})`
  position: fixed;
  height: 32px;
  width: 100%;
  color: ${colors.primaryText};
  background-color: ${colors.background.three};
  font-size: 14px;
  z-index: 1000;
`;

const HeaderContainer = styled.div.attrs({
  className: "d-flex flex-column justify-content-center",
})<MobileMenuOpenProps>`
  height: ${theme.header.height}px;
  position: sticky;
  top: 0;
  border-bottom: 1px solid ${colors.borderDark2};

  @media (max-width: ${sizes.lg}px) {
    padding: 16px 24px;
    border-bottom: none;
  }

  z-index: ${(props) => (props.isMenuOpen ? 50 : 10)};

  // The backdrop for the menu does not show up if we enable the backdrop-filter
  // for the header nav. To get around that, just set 'none'
  ${(props) => {
    if (props.isMenuOpen) {
      return null;
    }

    return `
      backdrop-filter: blur(40px);
      /**
       * Firefox desktop come with default flag to have backdrop-filter disabled
       * Firefox Android also currently has bug where backdrop-filter is not being applied
       * More info: https://bugzilla.mozilla.org/show_bug.cgi?id=1178765
       **/
      @-moz-document url-prefix() {
        background-color: rgba(0, 0, 0, 0.9);
      }
    `;
  }}

  &:before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    background: rgba(255, 255, 255, 0.01);
  }
`;

const InnerContainer = styled.div.attrs({
  className: "d-flex align-items-center",
})`
  position: relative;
`;

const LogoContainer = styled.div`
  padding-left: 40px;
  margin-right: auto;
  z-index: 1000;

  @media (max-width: ${sizes.lg}px) {
    padding-left: 0;
  }
`;

const HeaderAbsoluteContainer = styled.div`
  position: absolute;
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;

  @media (max-width: ${sizes.lg}px) {
    display: none;
  }
`;

const LinksContainer = styled.div`
  display: flex;
`;

const NavItem = styled.div<NavItemProps>`
  display: flex;
  align-items: center;
  padding: 0px 16px;
  height: 100%;
  opacity: ${(props) => (props.isSelected ? "1" : "0.48")};

  &:hover {
    opacity: ${(props) => (props.isSelected ? theme.hover.opacity : "1")};
  }

  @media (max-width: ${sizes.lg}px) {
    padding: 0px 0px 40px 48px;
  }
`;

const NavLinkText = styled(Title)`
  letter-spacing: 1.5px;
  font-size: 14px;
  line-height: 20px;

  @media (max-width: ${sizes.lg}px) {
    font-size: 24px;
  }
`;

const SecondaryMobileNavItem = styled.div`
  display: none;

  @media (max-width: ${sizes.lg}px) {
    display: flex;
    padding: 0px 0px 24px 48px;
  }
`;

const MobileOnly = styled.div`
  display: none;

  @media (max-width: ${sizes.lg}px) {
    display: flex;
  }
`;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  const onToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const renderLinkItem = (
    title: string,
    to: string,
    isSelected: boolean,
    primary: boolean = true,
    external: boolean = false
  ) => {
    return (
      <BaseLink
        to={to}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer noopener" : undefined}
        onClick={() => {
          if (!external) setIsMenuOpen(false);
        }}
      >
        {primary ? (
          <NavItem isSelected={isSelected}>
            <NavLinkText>{title}</NavLinkText>
          </NavItem>
        ) : (
          <SecondaryMobileNavItem>
            <Title fontSize={18} color={`${colors.primaryText}7A`}>
              {title}
            </Title>
          </SecondaryMobileNavItem>
        )}
      </BaseLink>
    );
  };

  return (
    <>
      <HeaderContainer isMenuOpen={isMenuOpen}>
        <InnerContainer>
          {/* LOGO */}
          <LogoContainer>
            <HeaderLogo />
          </LogoContainer>

          {/* LINKS */}
          <HeaderAbsoluteContainer>
            <LinksContainer>
              {renderLinkItem(
                "OVERVIEW",
                "/",
                Boolean(useRouteMatch({ path: "/", exact: true }))
              )}
              {renderLinkItem(
                "PROFILE",
                "/profile",
                Boolean(useRouteMatch({ path: "/profile", exact: true }))
              )}
              {/* {renderLinkItem(
            "VOTING",
            "/voting",
            Boolean(useRouteMatch({ path: "/voting", exact: true }))
          )} */}
            </LinksContainer>
          </HeaderAbsoluteContainer>

          <AccountStatus variant="desktop" />
          <DesktopSubmenu />

          {/* MOBILE MENU */}
          <MobileOnly>
            <MenuButton onToggle={onToggleMenu} isOpen={isMenuOpen} />
            <MobileOverlayMenu
              className="flex-column align-items-center justify-content-center"
              isMenuOpen={isMenuOpen}
              onClick={onToggleMenu}
              boundingDivProps={{
                style: {
                  marginRight: "auto",
                },
              }}
            >
              {renderLinkItem(
                "OVERVIEW",
                "/",
                Boolean(useRouteMatch({ path: "/", exact: true }))
              )}
              {renderLinkItem(
                "PROFILE",
                "/profile",
                Boolean(useRouteMatch({ path: "/profile", exact: true }))
              )}
              {renderLinkItem(
                "FAQS",
                "/faqs",
                Boolean(useRouteMatch({ path: "/faqs", exact: true }))
              )}
              {renderLinkItem(
                "DISCORD",
                "http://tiny.cc/ribbon-discord",
                false,
                false,
                true
              )}
              {renderLinkItem(
                "TWITTER",
                "https://twitter.com/ribbonfinance",
                false,
                false,
                true
              )}
              {renderLinkItem(
                "GITHUB",
                "https://github.com/ribbon-finance",
                false,
                false,
                true
              )}
              {renderLinkItem(
                "FAQS",
                "https://ribbon.finance/faq",
                false,
                false,
                true
              )}
              {renderLinkItem(
                "BLOG",
                "https://medium.com/@ribbonfinance",
                false,
                false,
                true
              )}
              {renderLinkItem(
                "TERMS",
                "https://ribbon.finance/terms",
                false,
                false,
                true
              )}
              {renderLinkItem(
                "POLICY",
                "https://ribbon.finance/policy",
                false,
                false,
                true
              )}
            </MobileOverlayMenu>
          </MobileOnly>
        </InnerContainer>
      </HeaderContainer>
      {showBanner && (
        <TempLMBanner>
          The liquidity mining program is now live. Stake your rTokens at&nbsp;
          <b>
            <a
              href="https://app.ribbon.finance/staking"
              target="_blank"
              rel="noreferrer noopener"
            >
              app.ribbon.finance
            </a>
          </b>
          <CloseButton>
            <MenuButton
              isOpen
              onToggle={() => setShowBanner(false)}
              size={20}
              color="#FFFFFFA3"
            />
          </CloseButton>
        </TempLMBanner>
      )}
    </>
  );
};

export default Header;
