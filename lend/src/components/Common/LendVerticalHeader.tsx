import React, { useState } from "react";
import styled from "styled-components";

import Logo from "./Logo";
import colors from "shared/lib/designSystem/colors";
import { Title } from "../../designSystem/index";
import LendModal from "../../components/Common/LendModal";
import sizes from "../../designSystem/sizes";
import {
  ModalContent,
  ModalContentMode,
} from "../../components/Common/ModalContent";
import theme from "../../designSystem/theme";

const VerticalHeaderContainer = styled.div`
  display: flex;
  width: 64px;
  height: 100vh;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border-right: 1px solid ${colors.border};
  padding: 40px 23px 28px 23px;
  @media (max-width: ${sizes.lg}px) {
    display: none;
  }
`;

const LogoContainer = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  bottom: 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  min-width: 64px;
  min-height: 64px;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  &:hover {
    opacity: ${theme.hover.opacity};
    cursor: pointer;
  }
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
  font-size: ${(props) =>
    props.size === undefined ? `14px` : `${props.size}px`};
  line-height: 20px;
`;

const VerticalHeaderTextContainer = styled.div`
  -webkit-transform: rotate(-90deg);
  -moz-transform: rotate(-90deg);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-top: 50%;
  z-index: 1000;
`;

const LendVerticalHeader: React.FC = () => {
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
      <VerticalHeaderContainer>
        <LogoContainer>
          <Logo />
        </LogoContainer>
        <VerticalHeaderTextContainer>
          <ButtonContainer
            onClick={() => {
              setModalContentMode("community");
            }}
          >
            <StyledTitle>Community</StyledTitle>
          </ButtonContainer>
        </VerticalHeaderTextContainer>
        <VerticalHeaderTextContainer>
          <ButtonContainer
            onClick={() => {
              setModalContentMode("about");
            }}
          >
            <StyledTitle>About</StyledTitle>
          </ButtonContainer>
        </VerticalHeaderTextContainer>
      </VerticalHeaderContainer>
    </>
  );
};

export default LendVerticalHeader;
