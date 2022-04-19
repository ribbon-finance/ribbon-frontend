import React, { useMemo } from "react";
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
import { ActionButton } from "shared/lib/components/Common/buttons";
import theme from "shared/lib/designSystem/theme";
import { StakingUpdateMode } from "./types";
import { useRBNTokenAccount } from "shared/lib/hooks/useRBNTokenSubgraph";
import { calculateInitialveRBNAmount } from "shared/lib/utils/governanceMath";
import { useTranslation } from "react-i18next";

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

interface StakingModalUpdatePreviewProps {
  stakingData: {
    amount: BigNumber;
    duration: Duration;
  };
  stakingUpdateMode: StakingUpdateMode;
  onConfirm: () => void;
  onBack: () => void;
}

const StakingModalUpdatePreview: React.FC<StakingModalUpdatePreviewProps> = ({
  stakingData,
  stakingUpdateMode,
  onConfirm,
  onBack,
}) => {
  const { t } = useTranslation();
  const { data: rbnTokenAccount } = useRBNTokenAccount();

  const title = useMemo(() => {
    switch (stakingUpdateMode) {
      case "increaseAmount":
        return t("governance:IncreaseLockPreviewModal:lockIncreasePreview");
      case "increaseDuration":
        return t("governance:IncreaseLockPreviewModal:newLockTimePreview");
    }
  }, [stakingUpdateMode, t]);

  const previewDataRows = useMemo(() => {
    const previewDataRows: { label: string; data: string }[] = [];

    const totalLockedRow = {
      label: t("governance:IncreaseLockPreviewModal:totalLocked"),
      data: `${formatBigNumber(
        stakingData.amount.add(
          rbnTokenAccount?.lockedBalance || BigNumber.from(0)
        )
      )} RBN`,
    };

    switch (stakingUpdateMode) {
      case "increaseAmount":
        previewDataRows.push({
          label: t("governance:IncreaseLockPreviewModal:increaseLockBy"),
          data: `${formatBigNumber(stakingData.amount)} RBN`,
        });
        previewDataRows.push(totalLockedRow);
        previewDataRows.push({
          label: t("governance:IncreaseLockPreviewModal:lockupExpiry"),
          data: moment().add(stakingData.duration).format("MMM, Do YYYY"),
        });
        break;
      case "increaseDuration":
        const expiryMoment =
          rbnTokenAccount && rbnTokenAccount.lockEndTimestamp
            ? moment.unix(rbnTokenAccount.lockEndTimestamp)
            : moment();
        const durationToExpiry = moment.duration(expiryMoment.diff(moment()));

        previewDataRows.push({
          label: t("governance:IncreaseLockPreviewModal:lockupIncreasedBy"),
          data: stakingData.duration
            .clone()
            .subtract(durationToExpiry)
            .humanize(),
        });
        previewDataRows.push({
          label: t("governance:IncreaseLockPreviewModal:newLockupExpiry"),
          data: moment().add(stakingData.duration).format("MMM, Do YYYY"),
        });
        previewDataRows.push(totalLockedRow);
        break;
    }

    previewDataRows.push({
      label: t("governance:IncreaseLockPreviewModal:votingPower"),
      data: `${formatBigNumberAmount(
        calculateInitialveRBNAmount(
          stakingData.amount.add(
            rbnTokenAccount?.lockedBalance || BigNumber.from(0)
          ),
          stakingData.duration
        )
      )} veRBN`,
    });

    return previewDataRows;
  }, [rbnTokenAccount, stakingData, stakingUpdateMode, t]);

  const buttonText = useMemo(() => {
    switch (stakingUpdateMode) {
      case "increaseAmount":
        return t("governance:IncreaseLockPreviewModal:increaseLockAmount");
      case "increaseDuration":
        return t("governance:IncreaseLockPreviewModal:increaseLockTime");
    }
  }, [stakingUpdateMode, t]);

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
        <Title fontSize={22} lineHeight={28} className="text-center">
          {title}
        </Title>
      </BaseModalContentColumn>

      {/* Data rows */}
      {previewDataRows.map((row, index) => (
        <BaseModalContentColumn key={index}>
          <div className="d-flex w-100 justify-content-between">
            <SecondaryText lineHeight={24}>{row.label}</SecondaryText>
            <Subtitle fontSize={14} lineHeight={24} letterSpacing={1}>
              {row.data}
            </Subtitle>
          </div>
        </BaseModalContentColumn>
      ))}

      <BaseModalContentColumn>
        <ActionButton onClick={onConfirm} className="py-3" color={colors.red}>
          {buttonText}
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
          {`${t(
            "governance:IncreaseLockPreviewModal:lockupPreviewWarning:1"
          )} `}
          <strong>
            {t("governance:IncreaseLockPreviewModal:lockupPreviewWarning:2")}
          </strong>
          {` ${t(
            "governance:IncreaseLockPreviewModal:lockupPreviewWarning:3"
          )}`}
        </PrimaryText>
      </BaseModalWarning>
    </>
  );
};

export default StakingModalUpdatePreview;
