import React, { useState } from "react";
import styled from "styled-components";

import Logo from "./Logo";
import colors from "shared/lib/designSystem/colors";
import sizes from "../../designSystem/sizes";
import { Title, BaseLink, Button } from "../../designSystem";
import MenuButton from "./MenuButton";
import { NavItemProps, MobileMenuOpenProps } from "./types";
import theme from "../../designSystem/theme";
import MobileOverlayMenu from "shared/lib/components/Common/MobileOverlayMenu";
import ItemWithDropdown from "./ItemWithDropdown";
import ExternalLinkIcon from "shared/lib/assets/icons/externalLink";

const HeaderContainer = styled.div<MobileMenuOpenProps>`
  height: ${theme.header.height}px;
  position: sticky;
  top: 0;
  border-bottom: 1px solid ${colors.border};

  @media (max-width: ${sizes.md}px) {
    padding: 16px 24px;
    border-bottom: none;
  }

  z-index: ${(props) => (props.isMenuOpen ? 50 : 10)};
  // The backdrop for the menu does not show up if we enable the backdrop-filter
  // for the header nav. To get around that, just set 'none'
  ${(props) => {
    if (props.isMenuOpen) {
      return `
      @media (min-width: ${sizes.md}px) {
        backdrop-filter: none
      }`;
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
`;

const LogoContainer = styled.div`
  padding-left: 40px;
  z-index: 1000;

  @media (max-width: ${sizes.md}px) {
    padding-left: 0;
  }
`;

const HeaderAbsoluteContainer = styled.div`
  position: absolute;
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;

  @media (max-width: ${sizes.md}px) {
    display: none;
  }
`;

const LinksContainer = styled.div`
  display: flex;
`;

const NavItem = styled.div<NavItemProps>`
  display: flex;
  align-items: center;
  height: 100%;
  opacity: ${(props) => (props.isSelected ? "1" : "0.48")};

  &:hover {
    opacity: ${(props) => (props.isSelected ? theme.hover.opacity : "1")};
  }

  @media (max-width: ${sizes.md}px) {
    &:not(:last-of-type) {
      padding: 0px 16px;
    }
  }
`;

const NavLinkText = styled(Title)`
  letter-spacing: 1.5px;
  font-size: 14px;
  line-height: 20px;

  @media (max-width: ${sizes.md}px) {
    font-size: 24px;
  }
`;

const SecondaryMobileNavItem = styled.div`
  display: none;

  @media (max-width: ${sizes.md}px) {
    display: flex;
    padding: 0px 0px 24px 48px;
  }
`;

const SecondaryMobileNavLinktext = styled(Title)`
  font-size: 18px;
  line-height: 24px;
  color: rgba(255, 255, 255, 0.48);
`;

const MobileOnly = styled.div`
  display: none;

  @media (max-width: ${sizes.md}px) {
    display: flex;
  }
`;

const ButtonText = styled.span`
  font-family: VCR;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 24px;
  text-align: center;
  text-transform: capitalize;
  color: ${colors.green};
`;

const AppButton = styled(Button)`
  padding-top: 12px;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 12px;
  border-radius: 8px;
  background: rgba(22, 206, 185, 0.08);
  border: none;

  &:hover {
    opacity: ${theme.hover.opacity};
  }
`;

const ButtonContainer = styled.div`
  z-index: 0;
  margin-right: 30px;

  @media (max-width: ${sizes.md}px) {
    display: none;
  }
`;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        onClick={onToggleMenu}
      >
        {primary ? (
          <NavItem isSelected={isSelected}>
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
          <SecondaryMobileNavItem>
            <SecondaryMobileNavLinktext>{title}</SecondaryMobileNavLinktext>
          </SecondaryMobileNavItem>
        )}
      </BaseLink>
    );
  };

  return (
    <HeaderContainer
      isMenuOpen={isMenuOpen}
      className="d-flex align-items-center justify-content-between"
    >
      {/* LOGO */}
      <LogoContainer>
        <Logo></Logo>
      </LogoContainer>
      {/* LINKS */}
      <HeaderAbsoluteContainer>
        <LinksContainer>
          <ItemWithDropdown
            variant="desktop"
            dropdownItems={[
              { text: "FAQ", link: "https://docs.ribbon.finance/faq" },
              { text: "Blog", link: "https://research.ribbon.finance" },
              { text: "Docs", link: "https://docs.ribbon.finance" },
              { text: "Terms", link: "/terms" },
              { text: "Policy", link: "/policy" },
            ]}
          >
            About
          </ItemWithDropdown>

          <ItemWithDropdown
            variant="desktop"
            dropdownItems={[
              { text: "Github", link: "https://github.com/ribbon-finance" },
              { text: "Discord", link: "http://discord.ribbon.finance" },
              { text: "Twitter", link: "https://twitter.com/ribbonfinance" },
              {
                text: "Governance Portal",
                link: "https://vote.ribbon.finance",
              },
              { text: "Snapshot", link: "https://snapshot.org/#/rbn.eth" },
              { text: "Media Kit", link: "/ribbon_media_kit.zip" },
            ]}
          >
            Community
          </ItemWithDropdown>

          <ItemWithDropdown
            variant="desktop"
            dropdownItems={[
              {
                text: "Token Terminal",
                link: "https://www.tokenterminal.com/terminal/projects/ribbon-finance",
              },
              {
                text: "Defi Llama",
                link: "https://defillama.com/protocol/ribbon-finance",
              },
            ]}
          >
            Data
          </ItemWithDropdown>

          {renderLinkItem(
            "TREASURY",
            "https://treasury.ribbon.finance/",
            false,
            true,
            true
          )}
        </LinksContainer>
      </HeaderAbsoluteContainer>

      <ButtonContainer>
        <a href="https://app.ribbon.finance">
          <AppButton>
            <ButtonText>START EARNING</ButtonText>
          </AppButton>
        </a>
      </ButtonContainer>

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
          style={{ paddingTop: 40 }}
        >
          {renderLinkItem("START EARNING", "https://app.ribbon.finance", true)}
          {renderLinkItem(
            "FAQ",
            "https://docs.ribbon.finance/faq",
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
            "SNAPSHOT",
            "https://snapshot.org/#/rbn.eth",
            false,
            false,
            true
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
          {renderLinkItem("POLICY", "/policy", false, false, true)}
          {renderLinkItem("TERMS", "/terms", false, false, true)}
        </MobileOverlayMenu>
      </MobileOnly>
    </HeaderContainer>
  );
};

export default Header;
