import React from "react";
import { BigNumber } from "@ethersproject/bignumber";
import moment, { Duration } from "moment";
import styled from "styled-components";

import {
  BaseModalContentColumn,
  BaseModalWarning,
  PrimaryText,
  Title,
} from "shared/lib/designSystem";
import ModalBackButton from "shared/lib/components/Common/ModalBackButton";
import ModalInfoColumn from "shared/lib/components/Common/ModalInfoColumn";
import colors from "shared/lib/designSystem/colors";
import { StakeIcon } from "shared/lib/assets/icons/icons";
import { formatBigNumber, formatBigNumberAmount } from "shared/lib/utils/math";
import { calculateInitialveRBNAmount } from "shared/lib/utils/governanceMath";
import { ActionButton } from "shared/lib/components/Common/buttons";

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
      <ModalBackButton onBack={onBack} />
      <BaseModalContentColumn>
        <LogoContainer>
          <StakeIcon size="32px" color={colors.red} />
        </LogoContainer>
      </BaseModalContentColumn>
      <BaseModalContentColumn marginTop={16}>
        <Title fontSize={22} lineHeight={28}>
          Lock Preview
        </Title>
      </BaseModalContentColumn>
      <ModalInfoColumn
        marginTop={48}
        label="Lock Amount"
        data={`${formatBigNumber(stakingData.amount)} RBN`}
      />
      <ModalInfoColumn
        label="Lockup Expiry"
        data={moment().add(stakingData.duration).format("MMM, Do YYYY")}
      />
      <ModalInfoColumn
        label="Initial Voting Power"
        data={`${formatBigNumberAmount(
          calculateInitialveRBNAmount(stakingData.amount, stakingData.duration)
        )} veRBN`}
      />
      <BaseModalContentColumn marginTop="auto">
        <ActionButton onClick={onConfirm} className="py-3" color={colors.red}>
          Lock RBN
        </ActionButton>
      </BaseModalContentColumn>
      <BaseModalWarning color={colors.green} className="mb-2">
        <PrimaryText
          fontSize={14}
          lineHeight={20}
          color={colors.green}
          fontWeight={400}
          className="text-center"
        >
          IMPORTANT: <strong>veRBN</strong> is not transferrable and unlocking
          RBN early results in a penalty of up to 75% of your RBN
        </PrimaryText>
      </BaseModalWarning>
    </>
  );
};

export default StakingModalPreview;
