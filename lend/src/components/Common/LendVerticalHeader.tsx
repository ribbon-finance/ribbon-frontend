import React, { useState } from "react";
import styled from "styled-components";

import Logo from "./Logo";
import colors from "shared/lib/designSystem/colors";
import { Title } from "../../designSystem/index";
import LendModal from "../../components/Common/LendModal";
import sizes from "../../designSystem/sizes";
import { ContentEnum } from "../../components/Common/ModalContent";
import theme from "../../designSystem/theme";
import { components } from "../../designSystem/components";

const VerticalHeaderContainer = styled.div`
  display: flex;
  width: ${components.sidebar}px;
  height: 100vh;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border-right: 1px solid ${colors.border};
  padding: 40px 23px 28px 23px;
  @media (max-width: ${sizes.lg}px) {
    display: none;
  }
  z-index: 100;
  background-color: ${colors.background.one};
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
  const [modalContent, setModalContent] = useState<ContentEnum>();

  return (
    <>
      <LendModal
        show={Boolean(modalContent)}
        content={modalContent}
        onHide={() => setModalContent(undefined)}
      />
      <VerticalHeaderContainer>
        <LogoContainer>
          <a href={"/"}>
            <Logo />
          </a>
        </LogoContainer>
        <VerticalHeaderTextContainer>
          <ButtonContainer
            onClick={() => setModalContent(ContentEnum.COMMUNITY)}
          >
            <StyledTitle>Community</StyledTitle>
          </ButtonContainer>
        </VerticalHeaderTextContainer>
        <VerticalHeaderTextContainer>
          <ButtonContainer onClick={() => setModalContent(ContentEnum.ABOUT)}>
            <StyledTitle>About</StyledTitle>
          </ButtonContainer>
        </VerticalHeaderTextContainer>
      </VerticalHeaderContainer>
    </>
  );
};

export default LendVerticalHeader;
