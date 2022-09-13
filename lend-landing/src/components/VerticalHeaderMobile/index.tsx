import React, { useMemo, useState } from "react";
import styled from "styled-components";

import colors from "shared/lib/designSystem/colors";
import { Title } from "shared/lib/designSystem";
import MobileOverlayMenu from "shared/lib/components/Common/MobileOverlayMenu";
import ExternalLinkIcon from "../Common/ExternalLinkIcon";
import Logo from "./Logo";
import sizes from "../../designSystem/sizes";
import MenuButton from "./MenuButton";
import { MobileMenuOpenProps } from "./types";
import theme from "../../designSystem/theme";
import InfoModal from "../Common/InfoModal";

const VerticalHeader = styled.div<MobileMenuOpenProps>`
  display: none;
  @media (max-width: ${sizes.lg}px) {
    height: 64px;
    border-bottom: 1px solid ${colors.border};
    // z-index: ${(props) => (props.isMenuOpen ? 50 : 10)};
    z-index: 10000;
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
  }
`;

const LogoContainer = styled.div`
  display: none;
  @media (max-width: ${sizes.lg}px) {
    position: relative;
    display: flex;
    justify-content: center;
    margin-left: 16px;
  }
`;

const NavItemsContainer = styled.div`
  border-top: 1px solid ${colors.primaryText}1F;

  > div {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${colors.background.one};
    width: 100%;
    height: 64px;
  }
`;

const NavItem = styled.div`
  border-bottom: 1px solid ${colors.primaryText}1F;

  &:hover {
    cursor: pointer;
    opacity: ${theme.hover.opacity};
  }

  @media (max-width: ${sizes.md}px) {
    &:not(:last-of-type) {
      padding: 0px 16px;
    }
  }
`;

const NavLinkText = styled(Title)`
  letter-spacing: 1.5px;
  font-size: 16px;
`;

const Footer = styled.div`
  font-size: 12px;
  color: ${colors.primaryText}52;

  svg {
    transition: all 0.2s ease-in-out;
  }

  > a {
    color: ${colors.primaryText}52;
    text-decoration: underline;
    &:hover {
      svg {
        transform: translate(2px, -2px);
      }
    }
  }
`;

const MobileOnly = styled.div`
  display: none;

  @media (max-width: ${sizes.lg}px) {
    display: flex;
  }
`;

const AboutContent = styled.div`
  color: ${colors.primaryText}A3;
  padding: 16px 24px;
`;

const MobileHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [modalContentMode, setModalContentMode] = useState<
    "about" | "community" | undefined
  >();

  const onToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const modalContent = useMemo(() => {
    if (modalContentMode === "about") {
      return (
        <AboutContent>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam,
          purus sit amet luctus venenatis, lectus magna fringilla urna,
          porttitor rhoncus dolor purus non enim praesent elementum facilisis
          leo, vel fringilla est ullamcorper eget nulla facilisi etiam dignissim
          diam quis enim lobortis scelerisque fermentum dui faucibus in ornare
          quam viverra orci sagittis eu volutpat odio facilisis mauris sit amet
          massa vitae tortor condimentum lacinia
        </AboutContent>
      );
    }
    return null;
  }, [modalContentMode]);

  return (
    <VerticalHeader
      isMenuOpen={isMenuOpen}
      className="d-flex align-items-center justify-content-between"
    >
      <LogoContainer>
        <Logo />
      </LogoContainer>
      <InfoModal
        show={Boolean(modalContentMode)}
        title={(modalContentMode ?? "").toUpperCase()}
        onHide={() => setModalContentMode(undefined)}
      >
        {modalContent}
      </InfoModal>

      <MobileOnly>
        <MenuButton onToggle={onToggleMenu} isOpen={isMenuOpen} />
        <MobileOverlayMenu
          className="flex-column align-items-center justify-content-start"
          isMenuOpen={isMenuOpen}
          onClick={onToggleMenu}
          boundingDivProps={{
            style: {
              marginRight: "auto",
              width: "100%",
            },
          }}
          style={{
            paddingTop: 72,
            backgroundColor: "transparent",
          }}
        >
          <NavItemsContainer>
            <NavItem
              onClick={() => {
                setIsMenuOpen(false);
                setModalContentMode("about");
              }}
            >
              <NavLinkText>ABOUT</NavLinkText>
            </NavItem>
            <NavItem
              onClick={() => {
                setIsMenuOpen(false);
                setModalContentMode("community");
              }}
            >
              <NavLinkText>COMMUNITY</NavLinkText>
            </NavItem>
            <Footer>
              Ribbon Lend is a product built by&nbsp;
              <a
                href="https://ribbon.finance"
                target="_blank"
                rel="noreferrer noopener"
              >
                Ribbon Finance
                <ExternalLinkIcon
                  style={{
                    marginRight: "4px",
                    opacity: 0.32,
                  }}
                />
              </a>
            </Footer>
          </NavItemsContainer>
        </MobileOverlayMenu>
      </MobileOnly>
    </VerticalHeader>
  );
};

export default MobileHeader;
