import React, { useState } from "react";
import styled from "styled-components";

import Logo from "./Logo";
import colors from "shared/lib/designSystem/colors";
import { Title } from "shared/lib/designSystem/index";
import sizes from "../../designSystem/sizes";
import MenuButton from "./MenuButton";
import MobileOverlayMenu from "shared/lib/components/Common/MobileOverlayMenu";
import { NavItemProps, MobileMenuOpenProps } from "./types";
import { Button } from "react-bootstrap";
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
  position: relative;
  display: flex;
  justify-content: center;
  z-index: 1000;
  margin-left: 16px;
`;

const StyledTitle = styled(Title)<{
  size?: number;
  marginLeft?: number;
  marginRight?: number;
  color?: string;
}>`
  text-align: center;
  color: ${(props) =>
    props.color === undefined ? `${colors.primaryText}` : `${props.color}`};
  margin-right: ${(props) =>
    props.marginRight === undefined ? `0px` : `${props.marginRight}px`};
  margin-left: ${(props) =>
    props.marginLeft === undefined ? `0px` : `${props.marginLeft}px`};
  font-size: ${(props) =>
    props.size === undefined ? `14px` : `${props.size}px`};
  line-height: 20px;
`;

const MobileOnly = styled.div`
  display: none;

  @media (max-width: ${sizes.md}px) {
    display: flex;
  }
`;

const MobileHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const onToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <VerticalHeader
      isMenuOpen={isMenuOpen}
      className="d-flex align-items-center justify-content-between"
    >
      <LogoContainer>
        <Logo />
      </LogoContainer>
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
        ></MobileOverlayMenu>
      </MobileOnly>
    </VerticalHeader>
  );
};

export default MobileHeader;
