import React, { useState } from "react";
import styled from "styled-components";

import colors from "shared/lib/designSystem/colors";
import { Title } from "shared/lib/designSystem";
import MobileOverlayMenu from "shared/lib/components/Common/MobileOverlayMenu";
import LendModal, { ModalContentEnum } from "../Common/LendModal";
import { AppLogo } from "../Common/Logos";
import sizes from "../../designSystem/sizes";
import MenuButton from "./MenuButton";
import { MobileMenuOpenProps } from "./types";
import theme from "../../designSystem/theme";
import { ProductDisclaimer } from "../ProductDisclaimer";
import Link from "../Common/Link";

const HeaderContainer = styled.div<MobileMenuOpenProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  @media (max-width: ${sizes.lg}px) {
    height: 64px;
    border-bottom: 1px solid ${colors.border};
    // z-index: ${(props) => (props.isMenuOpen ? 50 : 10)};
    z-index: 100000;
    // The backdrop for the menu does not show up if we enable the backdrop-filter
    // for the header nav. To get around that, just set 'none'
    ${(props) => {
      if (props.isMenuOpen) {
        return `
    @media (min-width: ${sizes.lg}px) {
      backdrop-filter: none
    }`;
      }

      return `
  backdrop-filter: blur(10px);
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

const MobileOnly = styled.div`
  display: none;

  @media (max-width: ${sizes.lg}px) {
    display: flex;
  }
`;

const MobileHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ModalContentEnum>();

  const onToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <HeaderContainer isMenuOpen={isMenuOpen} className="">
      <LogoContainer>
        <Link to="/app">
          <AppLogo />
        </Link>
      </LogoContainer>
      <LendModal
        show={Boolean(modalContent)}
        onHide={() => setModalContent(undefined)}
        content={modalContent}
      />

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
                setModalContent(ModalContentEnum.ABOUT);
              }}
            >
              <NavLinkText>{ModalContentEnum.ABOUT}</NavLinkText>
            </NavItem>
            <NavItem
              onClick={() => {
                setIsMenuOpen(false);
                setModalContent(ModalContentEnum.COMMUNITY);
              }}
            >
              <NavLinkText>{ModalContentEnum.COMMUNITY}</NavLinkText>
            </NavItem>
            <ProductDisclaimer />
          </NavItemsContainer>
        </MobileOverlayMenu>
      </MobileOnly>
    </HeaderContainer>
  );
};

export default MobileHeader;
