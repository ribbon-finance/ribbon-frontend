import React from "react";
import colors from "shared/lib/designSystem/colors";
import styled from "styled-components";
import { components } from "../../designSystem/components";
import { Title } from "../../designSystem";
import { ActionType } from "./types";

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

export enum ActionModalEnum {
  PREVIEW,
  TRANSACTION_STEP,
}

interface HeaderProps {
  actionType: ActionType;
  page: ActionModalEnum;
}

const Header: React.FC<HeaderProps> = ({ page, actionType, children }) => {
  return (
    <HeaderContainer>
      <HeaderText>
        {actionType === "deposit" &&
          (page === ActionModalEnum.PREVIEW ? "Deposit" : "Depositing")}
        {actionType === "withdraw" &&
          (page === ActionModalEnum.PREVIEW ? "Withdraw" : "Withdrawing")}
        {actionType === "migrate" &&
          (page === ActionModalEnum.PREVIEW ? "Migrate" : "Migrating")}{" "}
        USDC
      </HeaderText>
      {children}
    </HeaderContainer>
  );
};

export default Header;
