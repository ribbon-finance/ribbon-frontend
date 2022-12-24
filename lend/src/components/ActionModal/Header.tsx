import React from "react";
import colors from "shared/lib/designSystem/colors";
import styled from "styled-components";
import { components } from "../../designSystem/components";
import { Title } from "../../designSystem";
import { ActionType } from "./types";
import { Assets } from "../../store/types";

const HeaderContainer = styled.div`
  display: flex;
  margin: auto;
  width: 100%;
  justify-content: center;
  align-items: center;
  border-radius: 0;
  min-height: ${components.header}px;
  border-bottom: 1px solid ${colors.border};
  z-index: 1;
  color: ${colors.primaryText};

  > * {
    margin: auto 0;
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
  depositAsset: Assets;
}

const Header: React.FC<HeaderProps> = ({
  page,
  actionType,
  depositAsset,
  children,
}) => {
  return (
    <HeaderContainer>
      <HeaderText>
        {actionType === "deposit" &&
          (page === ActionModalEnum.PREVIEW ? "Deposit" : "Depositing")}
        {actionType === "withdraw" &&
          (page === ActionModalEnum.PREVIEW ? "Withdraw" : "Withdrawing")}{" "}
        {depositAsset}
      </HeaderText>
      {children}
    </HeaderContainer>
  );
};

export default Header;
