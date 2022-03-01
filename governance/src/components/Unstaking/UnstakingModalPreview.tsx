import React, { useMemo } from "react";
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
import { UnstakeIcon } from "shared/lib/assets/icons/icons";
import moment from "moment";
import { useRBNTokenAccount } from "shared/lib/hooks/useRBNTokenSubgraph";
import useLoadingText from "shared/lib/hooks/useLoadingText";
import { formatBigNumber } from "shared/lib/utils/math";
import { ActionButton } from "shared/lib/components/Common/buttons";
import {
  calculateEarlyUnlockPenalty,
  calculateEarlyUnlockPenaltyPercentage,
} from "shared/lib/utils/governanceMath";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import HelpInfo from "shared/lib/components/Common/HelpInfo";

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: ${colors.red}1F;
  border-radius: 100px;
`;

interface UnstakingModalPreviewProps {
  onUnstake: () => void;
}

const UnstakingModalPreview: React.FC<UnstakingModalPreviewProps> = ({
  onUnstake,
}) => {
  const { data: rbnTokenAccount, loading } = useRBNTokenAccount();
  const loadingText = useLoadingText();

  const canUnstake = useMemo(() => {
    return !loading && rbnTokenAccount && rbnTokenAccount.lockEndTimestamp;
  }, [loading, rbnTokenAccount]);

  const lockupAmountDisplay = useMemo(() => {
    if (loading) {
      return loadingText;
    }

    return `${
      rbnTokenAccount && rbnTokenAccount.lockedBalance
        ? formatBigNumber(rbnTokenAccount.lockedBalance)
        : "0"
    } RBN`;
  }, [loading, loadingText, rbnTokenAccount]);

  const lockupExpiryDisplay = useMemo(() => {
    if (loading) {
      return loadingText;
    }

    if (!rbnTokenAccount?.lockEndTimestamp) {
      return "---";
    }

    return moment.unix(rbnTokenAccount.lockEndTimestamp).format("MMM, Do YYYY");
  }, [loading, loadingText, rbnTokenAccount?.lockEndTimestamp]);

  const earlyUnlockDuration = useMemo(() => {
    const momentNow = moment();
    const expiryMoment =
      rbnTokenAccount && rbnTokenAccount.lockEndTimestamp
        ? moment.unix(rbnTokenAccount.lockEndTimestamp)
        : undefined;

    if (rbnTokenAccount && expiryMoment && momentNow.isBefore(expiryMoment)) {
      return moment.duration(expiryMoment.diff(momentNow));
    }
  }, [rbnTokenAccount]);

  const earlyUnlockPenaltyPercentageDisplay = useMemo(() => {
    if (earlyUnlockDuration) {
      return `${(
        calculateEarlyUnlockPenaltyPercentage(earlyUnlockDuration) * 100
      ).toFixed(2)}%`;
    }
  }, [earlyUnlockDuration]);

  const earlyUnlockPenaltyAmountDisplay = useMemo(() => {
    if (rbnTokenAccount && earlyUnlockDuration) {
      const penalty = calculateEarlyUnlockPenalty(
        rbnTokenAccount.lockedBalance,
        earlyUnlockDuration
      );
      return formatBigNumber(penalty);
    }
  }, [earlyUnlockDuration, rbnTokenAccount]);

  return (
    <>
      <BaseModalContentColumn>
        <LogoContainer>
          <UnstakeIcon size="32px" color={colors.red} />
        </LogoContainer>
      </BaseModalContentColumn>
      <BaseModalContentColumn marginTop={16}>
        <Title fontSize={22} lineHeight={28}>
          Unlock Your Ribbon
        </Title>
      </BaseModalContentColumn>
      <BaseModalContentColumn>
        <div className="d-flex w-100 align-items-center">
          <SecondaryText lineHeight={24}>RBN Available to Unlock</SecondaryText>
          <TooltipExplanation
            title="RBN AVAILABLE TO UNLOCK"
            explanation="The amount of locked RBN that you can now unlock."
            renderContent={({ ref, ...triggerHandler }) => (
              <HelpInfo containerRef={ref} {...triggerHandler}>
                i
              </HelpInfo>
            )}
          />
          <Subtitle
            fontSize={14}
            lineHeight={24}
            letterSpacing={1}
            className="ml-auto"
          >
            {lockupAmountDisplay}
          </Subtitle>
        </div>
      </BaseModalContentColumn>
      <BaseModalContentColumn>
        <div className="d-flex w-100 justify-content-between">
          <SecondaryText lineHeight={24}>Lockup Expiry</SecondaryText>
          <Subtitle fontSize={14} lineHeight={24} letterSpacing={1}>
            {lockupExpiryDisplay}
          </Subtitle>
        </div>
      </BaseModalContentColumn>
      {earlyUnlockPenaltyPercentageDisplay ? (
        <BaseModalContentColumn>
          <div className="d-flex w-100 align-items-center">
            <SecondaryText lineHeight={24}>Early Unlock Penalty</SecondaryText>
            <TooltipExplanation
              title="EARLY UNLOCK PENALTY"
              explanation={
                <>
                  The penalty incurred for unlocking RBN before the lockup
                  expiry date.
                  <br />
                  <br />
                  The penalty is calculated by taking the minimum between 0.75
                  and (time left until unlock) / 2 years. For example, if you
                  have 1 year left on your lock, the penalty is min(.75, 1/2) =
                  0.5. So the penalty is 50%. All penalties will be
                  redistributed to the remaining lockers pro-rata.
                </>
              }
              renderContent={({ ref, ...triggerHandler }) => (
                <HelpInfo containerRef={ref} {...triggerHandler}>
                  i
                </HelpInfo>
              )}
            />
            <Subtitle
              fontSize={14}
              lineHeight={24}
              letterSpacing={1}
              className="ml-auto"
            >
              {earlyUnlockPenaltyPercentageDisplay}
            </Subtitle>
          </div>
        </BaseModalContentColumn>
      ) : (
        <></>
      )}
      <BaseModalContentColumn marginTop="auto" className="mb-2">
        <ActionButton
          onClick={onUnstake}
          className="py-3"
          color={colors.red}
          disabled={!canUnstake}
        >
          {earlyUnlockDuration ? "CONFIRM EARLY UNLOCK" : "CONFIRM UNLOCK"}
        </ActionButton>
      </BaseModalContentColumn>
      {earlyUnlockPenaltyAmountDisplay && (
        <BaseModalWarning color={colors.green} className="mb-2" marginTop={16}>
          <PrimaryText
            fontSize={14}
            lineHeight={20}
            color={colors.green}
            fontWeight={400}
            className="text-center"
          >
            IMPORTANT: Unlocking your RBN early will result in a{" "}
            <b>penalty of RBN {earlyUnlockPenaltyAmountDisplay}</b>
          </PrimaryText>
        </BaseModalWarning>
      )}
    </>
  );
};

export default UnstakingModalPreview;
