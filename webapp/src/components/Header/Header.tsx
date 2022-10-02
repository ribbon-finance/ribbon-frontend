import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useRouteMatch } from "react-router-dom";
import { useWeb3Wallet } from "shared/lib/hooks/useWeb3Wallet";

import HeaderLogo from "./HeaderLogo";
import { URLS } from "shared/lib/constants/constants";
import colors from "shared/lib/designSystem/colors";
import sizes from "shared/lib/designSystem/sizes";
import { Title, BaseLink } from "shared/lib/designSystem";
import MenuButton from "shared/lib/components/Common/MenuButton";
import { NavItemProps, MobileMenuOpenProps } from "./types";
import AccountStatus from "../Wallet/AccountStatus";
import theme from "shared/lib/designSystem/theme";
import MobileOverlayMenu from "shared/lib/components/Common/MobileOverlayMenu";
import NetworkSwitcherButton from "../NetworkSwitcher/NetworkSwitcherButton";
import NotificationButton from "../Notification/NotificationButton";
import { isEthNetwork } from "shared/lib/constants/constants";
import ExternalLinkIcon from "shared/lib/assets/icons/externalLink";
import { useGlobalState } from "shared/lib/store/store";
import FilterDropdown from "shared/lib/components/Common/FilterDropdown";
import { useHistory } from "react-router-dom";

const HeaderContainer = styled.div<MobileMenuOpenProps>`
  height: ${theme.header.height}px;
  position: sticky;
  top: 0;
  border-bottom: 1px solid ${colors.border};

  @media (max-width: ${sizes.xl}px) {
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

const LogoContainer = styled.div`
  padding-left: 40px;
  margin-right: auto;
  z-index: 1000;

  @media (max-width: ${sizes.xl}px) {
    padding-left: 0;
  }
`;

const HeaderButtonContainer = styled.div`
  display: flex;
  margin-right: 8px;
  z-index: 1;
`;

const HeaderAbsoluteContainer = styled.div`
  position: absolute;
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;

  @media (max-width: ${sizes.xl}px) {
    display: none;
  }
`;

const LinksContainer = styled.div`
  display: flex;
`;

const NavItem = styled.div.attrs({
  className: "d-flex align-items-center justify-content-center",
})<NavItemProps>`
  padding: 0px 16px;
  height: 100%;
  opacity: ${(props) => (props.isSelected ? "1" : "0.48")};

  &:hover {
    opacity: ${(props) =>
      props.isHighlighted ? "1" : props.isSelected ? theme.hover.opacity : "1"};
  }

  @media (max-width: ${sizes.xl}px) {
    padding: 0px 0px 40px 48px;
  }
`;

const NavLinkText = styled(Title)`
  letter-spacing: 1.5px;
  font-size: 12px;
  line-height: 16px;

  @media (max-width: ${sizes.xl}px) {
    font-size: 24px;
  }
`;

const SecondaryMobileNavItem = styled.div`
  display: none;

  @media (max-width: ${sizes.xl}px) {
    display: flex;
    padding: 0px 0px 24px 48px;
  }
`;

const MobileOnly = styled.div`
  display: none;

  @media (max-width: ${sizes.xl}px) {
    display: flex;
  }
`;

const Header = () => {
  const history = useHistory();
  const { active, chainId } = useWeb3Wallet();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const product = useRouteMatch({ path: "/", exact: true });
  const portfolio = useRouteMatch({ path: "/portfolio", exact: true });
  const headerRef = useRef<HTMLDivElement>(null);
  const [, setComponentRefs] = useGlobalState("componentRefs");

  const onToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    if (headerRef.current) {
      setComponentRefs((prev) => ({
        ...prev,
        header: headerRef.current as HTMLDivElement,
      }));
    }
  }, [headerRef, setComponentRefs]);

  const openLink = useCallback((link) => {
    setIsMenuOpen(false);
    window.open(link);
  }, []);

  const renderLinkItem = (
    title: string,
    to: string,
    isSelected: boolean,
    primary: boolean = true,
    external: boolean = false,
    isHighlighted: boolean = false
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
          <NavItem isSelected={isSelected} isHighlighted={isHighlighted}>
            <NavLinkText color={isHighlighted ? colors.green : undefined}>
              {title}
            </NavLinkText>
            {external && (
              <ExternalLinkIcon
                color={isHighlighted ? colors.green : undefined}
                style={{
                  marginLeft: 6,
                }}
              />
            )}
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
    <HeaderContainer
      ref={headerRef}
      isMenuOpen={isMenuOpen}
      className="d-flex align-items-center"
    >
      {/* LOGO */}
      <LogoContainer>
        <HeaderLogo />
      </LogoContainer>

      {/* LINKS */}
      <HeaderAbsoluteContainer>
        <LinksContainer>
          {renderLinkItem("PRODUCTS", "/", Boolean(product))}
          {renderLinkItem("PORTFOLIO", "/portfolio", Boolean(portfolio))}
          {chainId && isEthNetwork(chainId) && (
            // renderLinkItem("STAKING", "/staking", Boolean(staking))}
            <div className="d-flex justify-content-center align-items-center">
              <FilterDropdown
                options={[
                  {
                    display: "VAULT TOKEN",
                    value: "VAULT TOKEN",
                    externalLink: false,
                  },
                  {
                    display: "RBN",
                    value: "RBN",
                    externalLink: true,
                  },
                ]}
                value={"STAKING"}
                onSelect={(option: any) => {
                  if (option === "VAULT TOKEN") {
                    history.push("./staking");
                  } else {
                    openLink(URLS.governance);
                  }
                }}
                buttonConfig={{
                  background: "none",
                  activeBackground: `none`,
                  color: colors.primaryText,
                  header: true,
                }}
                menuItemTextConfig={{
                  fontSize: 12,
                  letterSpacing: 1.5,
                }}
              />
            </div>
          )}
          {renderLinkItem("LEND", URLS.lend, true, true, true, true)}
        </LinksContainer>
      </HeaderAbsoluteContainer>

      {active && (
        <HeaderButtonContainer>
          <NetworkSwitcherButton />
        </HeaderButtonContainer>
      )}

      {active && (
        <HeaderButtonContainer>
          <NotificationButton />
        </HeaderButtonContainer>
      )}

      <AccountStatus variant="desktop" />

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
            "PRODUCTS",
            "/",
            Boolean(useRouteMatch({ path: "/", exact: true }))
          )}
          {renderLinkItem(
            "PORTFOLIO",
            "/portfolio",
            Boolean(useRouteMatch({ path: "/portfolio", exact: true }))
          )}
          {renderLinkItem(
            "VAULT TOKENS",
            "/staking",
            Boolean(useRouteMatch({ path: "/staking", exact: true }))
          )}
          {renderLinkItem("STAKE RBN", URLS.governance, false, true, true)}
          {renderLinkItem("LEND", URLS.lend, true, true, true, true)}
          {renderLinkItem("DISCORD", URLS.discord, false, false, true)}
          {renderLinkItem("TWITTER", URLS.twitter, false, false, true)}
          {renderLinkItem("GITHUB", URLS.github, false, false, true)}
          {renderLinkItem("FAQ", URLS.docsFaq, false, false, true)}
          {renderLinkItem("BLOG", URLS.medium, false, false, true)}
          {renderLinkItem("TERMS", URLS.ribbonFinanceTerms, false, false, true)}
          {renderLinkItem(
            "POLICY",
            URLS.ribbonFinancePolicy,
            false,
            false,
            true
          )}

          {renderLinkItem("AUCTIONS", URLS.auction, false, false, true)}
        </MobileOverlayMenu>
      </MobileOnly>
    </HeaderContainer>
  );
};

export default Header;
