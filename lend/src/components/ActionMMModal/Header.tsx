import React from "react";
import colors from "shared/lib/designSystem/colors";
import styled from "styled-components";
import { components } from "../../designSystem/components";
import { Title } from "../../designSystem";

const HeaderContainer = styled.div`
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

const HeaderText = styled(Title)`
  font-size: 16px;
  line-height: 20px;
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
