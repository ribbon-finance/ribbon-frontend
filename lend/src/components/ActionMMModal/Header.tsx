import React from "react";
import { Row } from "react-bootstrap";
import colors from "shared/lib/designSystem/colors";
import styled, { keyframes } from "styled-components";
import { components } from "../../designSystem/components";
import { Title } from "../../designSystem";
import sizes from "../../designSystem/sizes";
import { fadeIn, fadeInDisabled } from "shared/lib/designSystem/keyframes";
import { css } from "styled-components";

export const FixedContainer = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  background: black;
  z-index: 100;
  width: 100%;
  height: 100%;
`;

export const HeaderRow = styled(Row)`
  height: ${components.header}px;
  border-bottom: 1px solid ${colors.border};
  z-index: 1;
  margin-left: 0px;

  > * {
    padding: 0;

    &:not(:last-child) {
      border-right: 1px solid ${colors.border};
    }
  }
`;

export const FooterRow = styled(Row)`
  min-height: ${components.footer}px;
  border-top: 1px solid ${colors.border};
  box-sizing: content-box;
`;

export const HeaderContainer = styled.div`
  display: flex;
  margin: auto;
  width: 100%;
  justify-content: center;
  border-radius: 0;
  min-height: ${components.header}px;
  border-bottom: 1px solid ${colors.border};
  z-index: 1;
  color: ${colors.primaryText};

  > * {
    margin: auto 0;

    &:not(:last-child) {
      margin-right: 8px;
    }
  }
`;

export const HeaderText = styled(Title)`
  font-size: 16px;
  line-height: 20px;
`;

export const DetailContainer = styled.div<{ show?: boolean; delay?: number }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;
  ${({ show, delay }) => {
    return (
      show &&
      css`
        opacity: 0;

        &:disabled {
          opacity: 0;
        }

        animation: ${fadeIn} 1s ease-in-out forwards;
        animation-delay: ${delay || 0}s;
      `
    );
  }}
`;

export const Content = styled(Row)`
  height: calc(100% - ${components.header}px - ${components.footer}px);

  @media (max-width: ${sizes.lg}px) {
    height: 100%;
  }

  > *:not(:last-child) {
    border-right: 1px solid ${colors.border};
  }
`;

interface HeaderProps {
  isBorrow: boolean;
}

const Header: React.FC<HeaderProps> = ({ isBorrow, children }) => {
  return (
    <HeaderContainer>
      <HeaderText>{isBorrow ? "BORROW" : "REPAY"} USDC</HeaderText>
      {children}
    </HeaderContainer>
  );
};

export default Header;
