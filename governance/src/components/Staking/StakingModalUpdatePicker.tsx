import React from "react";
import styled from "styled-components";

import {
  BaseButton,
  BaseModalContentColumn,
  SecondaryText,
  Title,
} from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import { StakeIcon } from "shared/lib/assets/icons/icons";
import { StakingUpdateMode } from "./types";
import theme from "shared/lib/designSystem/theme";

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: ${colors.red}1F;
  border-radius: 100px;
`;

const ModePickerButton = styled(BaseButton)`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 16px;
  justify-content: center;
  color: ${colors.primaryText};
  border-radius: ${theme.border.radiusSmall};
  background-color: ${colors.background.three};
  border: ${theme.border.width} ${theme.border.style} transparent;
  transition: all 0.15s ease-in-out;

  span {
    transition: all 0.2s ease-in-out;
  }

  &:hover {
    color: ${colors.green};
    background-color: ${colors.green}1F;
    border-color: ${colors.green};

    span {
      color: ${colors.green};
    }
  }
`;

interface StakeUpdatePickerProps {
  onSelect: (mode: StakingUpdateMode) => void;
}

const StakeUpdatePicker: React.FC<StakeUpdatePickerProps> = ({ onSelect }) => {
  return (
    <>
      <BaseModalContentColumn>
        <LogoContainer>
          <StakeIcon size="32px" color={colors.red} />
        </LogoContainer>
      </BaseModalContentColumn>
      <BaseModalContentColumn>
        <Title fontSize={22} lineHeight={28}>
          UPDATE YOUR LOCK
        </Title>
      </BaseModalContentColumn>
      <BaseModalContentColumn marginTop={12}>
        <SecondaryText className="text-center" fontWeight={400}>
          Increase your veRBN balance by locking more RBN and / or increasing
          the lock time for your locked RBN balance
        </SecondaryText>
      </BaseModalContentColumn>
      <BaseModalContentColumn>
        <ModePickerButton
          role="button"
          onClick={() => onSelect("increaseAmount")}
        >
          <Title fontSize={14} lineHeight={24} letterSpacing={1}>
            Increase LOCK Amount
          </Title>
          <i className="fas fa-arrow-right ml-auto" />
        </ModePickerButton>
      </BaseModalContentColumn>
      <BaseModalContentColumn marginTop={16}>
        <ModePickerButton
          role="button"
          onClick={() => onSelect("increaseDuration")}
        >
          <Title fontSize={14} lineHeight={24} letterSpacing={1}>
            INCREASE LOCK TIME
          </Title>
          <i className="fas fa-arrow-right ml-auto" />
        </ModePickerButton>
      </BaseModalContentColumn>
    </>
  );
};

export default StakeUpdatePicker;
