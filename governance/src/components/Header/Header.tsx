import { useCallback, useRef, useState } from "react";
import styled from "styled-components";
import { useRouteMatch } from "react-router-dom";

import HeaderLogo from "./HeaderLogo";
import colors from "shared/lib/designSystem/colors";
import sizes from "shared/lib/designSystem/sizes";
import { Title, BaseLink } from "shared/lib/designSystem";
import MenuButton from "shared/lib/components/Common/MenuButton";
import theme from "shared/lib/designSystem/theme";
import MobileOverlayMenu from "shared/lib/components/Common/MobileOverlayMenu";
import ExternalLinkWarningModal from "shared/lib/components/Common/ExternalLinkWarningModal";
import ExternalLinkIcon from "shared/lib/assets/icons/externalLink";
import ButtonArrow from "shared/lib/components/Common/ButtonArrow";
import { NavItemProps, MobileMenuOpenProps } from "./types";
import AccountStatus from "../Wallet/AccountStatus";
import DesktopSubmenu from "./DesktopSubmenu";
import DesktopFloatingMenu from "shared/lib/components/Menu/DesktopFloatingMenu";
import { MenuItem } from "shared/lib/components/Menu/MenuItem";
import useOutsideAlerter from "shared/lib/hooks/useOutsideAlerter";
import { useTranslation } from "react-i18next";

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

const NavItem = styled.div.attrs({
  className: "d-flex align-items-center justify-content-center",
  role: "button",
})<NavItemProps>`
  position: relative;
  padding: 0px 16px;
  height: 100%;
  color: ${colors.primaryText};
  opacity: ${(props) => (props.isSelected ? "1" : "0.48")};

  &:hover {
    opacity: 1;
  }

  @media (max-width: ${sizes.lg}px) {
    padding: 0px 0px 40px 48px;
  }
`;

const DropdownArrow = styled(ButtonArrow)`
  margin-left: 10px;
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

type VotingLinkType = "proposal" | "gaugeVoting";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [votingMenuOpen, setVotingMenuOpen] = useState(false);
  const [votingLinkType, setVotingLinkType] = useState<VotingLinkType>();

  const { t } = useTranslation();

  // Track clicked area outside of desktop menu
  const votingMenuRef = useRef(null);
  useOutsideAlerter(votingMenuRef, () => {
    if (votingMenuOpen) {
      setVotingMenuOpen(false);
    }
  });

  const onToggleMenu = useCallback(() => {
    setIsMenuOpen(!isMenuOpen);
  }, [isMenuOpen]);

  const onContinueToVotingLink = useCallback(() => {
    switch (votingLinkType) {
      case "gaugeVoting":
        window.open("https://hiddenhand.finance/ribbon");
        break;
      case "proposal":
        window.open("https://snapshot.org/#/rbn.eth");
        break;
    }
    setVotingLinkType(undefined);
  }, [votingLinkType]);

  const renderLinkItem = (
    title: string,
    to: string,
    isSelected: boolean,
    primary: boolean = true,
    external: boolean = false,
    onClick?: () => void
  ) => {
    const Item = primary ? (
      <NavItem isSelected={isSelected} onClick={onClick}>
        <NavLinkText>{title}</NavLinkText>
        {external && (
          <ExternalLinkIcon
            style={{
              marginLeft: 6,
            }}
          />
        )}
      </NavItem>
    ) : (
      <SecondaryMobileNavItem onClick={onClick}>
        <Title fontSize={18} color={`${colors.primaryText}7A`}>
          {title}
        </Title>
      </SecondaryMobileNavItem>
    );

    if (onClick) {
      return Item;
    }

    return (
      <BaseLink
        to={to}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer noopener" : undefined}
        onClick={() => {
          if (!external) setIsMenuOpen(false);
        }}
      >
        {Item}
      </BaseLink>
    );
  };

  return (
    <>
      <HeaderContainer isMenuOpen={isMenuOpen}>
        <ExternalLinkWarningModal
          show={votingLinkType === "gaugeVoting"}
          onClose={() => setVotingLinkType(undefined)}
          onContinue={onContinueToVotingLink}
          message={t("shared:WarningModal:gaugeVoting:message")}
          continueText={t("shared:WarningModal:gaugeVoting:proceed")}
        />
        <ExternalLinkWarningModal
          show={votingLinkType === "proposal"}
          onClose={() => setVotingLinkType(undefined)}
          onContinue={onContinueToVotingLink}
          message={t("shared:WarningModal:governanceProposal:message")}
          continueText={t("shared:WarningModal:governanceProposal:proceed")}
        />

        <InnerContainer>
          {/* LOGO */}
          <LogoContainer>
            <HeaderLogo />
          </LogoContainer>

          {/* LINKS */}
          <HeaderAbsoluteContainer>
            <LinksContainer>
              {renderLinkItem(
                t("governance:Navigation:overview"),
                "/",
                Boolean(useRouteMatch({ path: "/", exact: true }))
              )}
              {renderLinkItem(
                t("governance:Navigation:profile"),
                "/profile",
                Boolean(useRouteMatch({ path: "/profile", exact: true }))
              )}
              <NavItem
                ref={votingMenuRef}
                isSelected={votingMenuOpen}
                onClick={() => setVotingMenuOpen(true)}
              >
                <NavLinkText>VOTING</NavLinkText>
                <DropdownArrow isOpen={votingMenuOpen} />
                <DesktopFloatingMenu
                  isOpen={votingMenuOpen}
                  containerStyle={{
                    left: 0,
                  }}
                >
                  <MenuItem
                    title={t("governance:Navigation:gaugeVoting")}
                    onClick={() => setVotingLinkType("gaugeVoting")}
                    extra={<ExternalLinkIcon style={{ marginLeft: 8 }} />}
                  />
                  <MenuItem
                    title={t("governance:Navigation:governanceProposal")}
                    onClick={() => setVotingLinkType("proposal")}
                    extra={<ExternalLinkIcon style={{ marginLeft: 8 }} />}
                  />
                </DesktopFloatingMenu>
              </NavItem>
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
                t("governance:Navigation:overview"),
                "/",
                Boolean(useRouteMatch({ path: "/", exact: true }))
              )}
              {renderLinkItem(
                t("governance:Navigation:profile"),
                "/profile",
                Boolean(useRouteMatch({ path: "/profile", exact: true }))
              )}
              {renderLinkItem(
                t("governance:Navigation:gaugeVoting"),
                "/profile",
                false,
                true,
                true,
                () => setVotingLinkType("gaugeVoting")
              )}
              {renderLinkItem(
                t("governance:Navigation:governanceProposal"),
                "/profile",
                false,
                true,
                true,
                () => setVotingLinkType("proposal")
              )}
              {renderLinkItem(
                t("governance:Navigation:faqs"),
                "/faqs",
                Boolean(useRouteMatch({ path: "/faqs", exact: true }))
              )}
              {renderLinkItem(
                t("shared:Navigation:discord"),
                "http://tiny.cc/ribbon-discord",
                false,
                false,
                true
              )}
              {renderLinkItem(
                t("shared:Navigation:twitter"),
                "https://twitter.com/ribbonfinance",
                false,
                false,
                true
              )}
              {renderLinkItem(
                t("shared:Navigation:github"),
                "https://github.com/ribbon-finance",
                false,
                false,
                true
              )}
              {renderLinkItem(
                t("shared:Navigation:blog"),
                "https://medium.com/@ribbonfinance",
                false,
                false,
                true
              )}
              {renderLinkItem(
                t("shared:Navigation:terms"),
                "https://ribbon.finance/terms",
                false,
                false,
                true
              )}
              {renderLinkItem(
                t("shared:Navigation:policy"),
                "https://ribbon.finance/policy",
                false,
                false,
                true
              )}
            </MobileOverlayMenu>
          </MobileOnly>
        </InnerContainer>
      </HeaderContainer>
    </>
  );
};

export default Header;
