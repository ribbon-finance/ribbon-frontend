import React from "react";
import { BigNumber } from "@ethersproject/bignumber";
import moment, { Duration } from "moment";
import styled from "styled-components";

import {
  BaseModalContentColumn,
  BaseModalWarning,
  PrimaryText,
  SecondaryText,
  Subtitle,
  Title,
} from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import { StakeIcon } from "shared/lib/assets/icons/icons";
import { formatBigNumber, formatBigNumberAmount } from "shared/lib/utils/math";
import { calculateInitialveRBNAmount } from "../../utils/math";
import { ActionButton } from "shared/lib/components/Common/buttons";
import theme from "shared/lib/designSystem/theme";

const ModalBackButton = styled.div`
  display: flex;
  position: absolute;
  z-index: 1000;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 40px;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: 40px;
`;

const ArrowBack = styled.i`
  color: ${colors.text};
  height: 14px;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: ${colors.red}1F;
  border-radius: 100px;
`;

interface StakingModalPreviewProps {
  stakingData: {
    amount: BigNumber;
    duration: Duration;
  };
  onConfirm: () => void;
  onBack: () => void;
}

const StakingModalPreview: React.FC<StakingModalPreviewProps> = ({
  stakingData,
  onConfirm,
  onBack,
}) => {
  return (
    <>
      <ModalBackButton role="button" onClick={onBack}>
        <ArrowBack className="fas fa-arrow-left" />
      </ModalBackButton>
      <BaseModalContentColumn>
        <LogoContainer>
          <StakeIcon size="32px" color={colors.red} />
        </LogoContainer>
      </BaseModalContentColumn>
      <BaseModalContentColumn marginTop={16}>
        <Title fontSize={22} lineHeight={28}>
          Staking Preview
        </Title>
      </BaseModalContentColumn>
      <BaseModalContentColumn>
        <div className="d-flex w-100 justify-content-between">
          <SecondaryText lineHeight={24}>Stake Amount</SecondaryText>
          <Subtitle fontSize={14} lineHeight={24} letterSpacing={1}>
            {formatBigNumber(stakingData.amount)} RBN
          </Subtitle>
        </div>
      </BaseModalContentColumn>
      <BaseModalContentColumn>
        <div className="d-flex w-100 justify-content-between">
          <SecondaryText lineHeight={24}>Lockup Expiry</SecondaryText>
          <Subtitle fontSize={14} lineHeight={24} letterSpacing={1}>
            {moment().add(stakingData.duration).format("MMMM, Do YYYY")}
          </Subtitle>
        </div>
      </BaseModalContentColumn>
      <BaseModalContentColumn>
        <div className="d-flex w-100 justify-content-between">
          <SecondaryText lineHeight={24}>Initial Voting Power</SecondaryText>
          <Subtitle fontSize={14} lineHeight={24} letterSpacing={1}>
            {formatBigNumberAmount(
              calculateInitialveRBNAmount(
                stakingData.amount,
                stakingData.duration
              )
            )}{" "}
            veRBN
          </Subtitle>
        </div>
      </BaseModalContentColumn>
      <BaseModalContentColumn>
        <ActionButton onClick={onConfirm} className="py-3" color={colors.red}>
          Preview Stake
        </ActionButton>
      </BaseModalContentColumn>
      <BaseModalWarning color={colors.green}>
        <PrimaryText
          fontSize={14}
          lineHeight={20}
          color={colors.green}
          fontWeight={400}
          className="text-center"
        >
          IMPORTANT: <strong>veRBN</strong> is not transferrable and your RBN
          will be locked up till expiry
        </PrimaryText>
      </BaseModalWarning>
    </>
  );
};

export default StakingModalPreview;
