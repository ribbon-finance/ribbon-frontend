import React, { useState } from "react";
import styled from "styled-components";

import Logo from "./Logo";
import colors from "shared/lib/designSystem/colors";
import { Title } from "shared/lib/designSystem/index";
import LendModal from "shared/lib/components/Common/LendModal";
import sizes from "../../designSystem/sizes";
import { ModalContent, ModalContentMode } from "../Common/ModalContent";
import theme from "../../designSystem/theme";

const VerticalHeader = styled.div`
  display: flex;
  width: 64px;
  height: 100vh;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  border-right: 1px solid ${colors.border};
  padding: 56px 23px 44px 23px;
  background: black;
  z-index: 1000;
  @media (max-width: ${sizes.lg}px) {
    display: none;
  }
`;

const LogoContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 1000;
  top: 0;
  bottom: 0;
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
  &:hover {
    cursor: pointer;
    opacity: ${theme.hover.opacity};
  }
`;

const VerticalHeaderTextContainer = styled.div`
  -webkit-transform: rotate(-90deg);
  -moz-transform: rotate(-90deg);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-top: 50%;
`;

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [modalContentMode, setModalContentMode] = useState<ModalContentMode>();

  return (
    <>
      <LendModal
        show={Boolean(modalContentMode)}
        title={(modalContentMode ?? "").toUpperCase()}
        onHide={() => setModalContentMode(undefined)}
      >
        <ModalContent modalContentMode={modalContentMode} />
      </LendModal>
      <VerticalHeader>
        <LogoContainer>
          <Logo />
        </LogoContainer>
        <VerticalHeaderTextContainer>
          <StyledTitle
            role={"button"}
            onClick={() => {
              setIsMenuOpen(false);
              setModalContentMode("about");
            }}
          >
            Community
          </StyledTitle>
        </VerticalHeaderTextContainer>
        <VerticalHeaderTextContainer>
          <StyledTitle>About</StyledTitle>
        </VerticalHeaderTextContainer>
      </VerticalHeader>
    </>
  );
};

export default Header;
