import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { BigNumber } from "ethers";
import moment, { duration, Duration, Moment } from "moment";

import { CalendarIcon, StakeIcon } from "shared/lib/assets/icons/icons";
import {
  BaseInputLabel,
  BaseModalContentColumn,
  BaseModalWarning,
  SecondaryText,
  Subtitle,
  Title,
} from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import { useRBNTokenAccount } from "shared/lib/hooks/useRBNTokenSubgraph";
import { formatBigNumber, formatBigNumberAmount } from "shared/lib/utils/math";
import { ActionButton } from "shared/lib/components/Common/buttons";
import StakingModalFormCalendarOverlay from "./StakingModalFormCalendarOverlay";
import InlineSelectInput from "shared/lib/components/Common/InlineSelectInput";
import { calculateInitialveRBNAmount } from "shared/lib/utils/governanceMath";
import { useTranslation } from "react-i18next";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import HelpInfo from "shared/lib/components/Common/HelpInfo";

const durationSelectOptions = ["1W", "1M", "3M", "6M", "1Y", "custom"] as const;
type DurationSelectOption = typeof durationSelectOptions[number];
const durationSelectOptionsExcludeCustom = durationSelectOptions.filter(
  (option) => option !== "custom"
);

const getDurationSelectOptionFromDuration = (
  duration: Duration
): DurationSelectOption => {
  switch (Math.floor(duration.asDays())) {
    case 7:
      return "1W";
    case 30:
      return "1M";
    case 91:
      return "3M";
    case 182:
      return "6M";
    case 365:
      return "1Y";
    default:
      return "custom";
  }
};

const getDaysFromDurationSelectOption = (option: DurationSelectOption) => {
  switch (option) {
    case "1W":
      return 7;
    case "1M":
      return 30;
    case "3M":
      return 91;
    case "6M":
      return 182;
    case "1Y":
      return 365;
    default:
      return 0;
  }
};

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: ${colors.red}1F;
  border-radius: 100px;
`;

const StakingWarningHighlight = styled.strong`
  color: ${colors.green};
`;

interface StakingModalIncreaseDurationFormProps {
  initialStakingData: {
    amount: BigNumber;
    duration: Duration;
  };
  proceedToPreview: (amount: BigNumber, duration: Duration) => void;
}

const StakingModalIncreaseDurationForm: React.FC<
  StakingModalIncreaseDurationFormProps
> = ({ initialStakingData, proceedToPreview }) => {
  const { t } = useTranslation();
  const { data: rbnTokenAccount } = useRBNTokenAccount();

  const [expiryMoment, durationToExpiry] = useMemo(() => {
    const expiryMoment =
      rbnTokenAccount && rbnTokenAccount.lockEndTimestamp
        ? moment.unix(rbnTokenAccount.lockEndTimestamp)
        : moment();

    return [expiryMoment, moment.duration(expiryMoment.diff(moment()))];
  }, [rbnTokenAccount]);

  const [showCalendarPicker, setShowCalendarPicker] = useState(false);
  const [durationSelectValue, setDurationSelectValue] =
    useState<DurationSelectOption>(
      initialStakingData.duration.asDays() === 0
        ? durationSelectOptions[0]
        : getDurationSelectOptionFromDuration(
            initialStakingData.duration.clone().subtract(durationToExpiry)
          )
    );
  const [calendarDate, setCalendarDate] = useState<Moment>();

  const stakeDuration = useMemo(() => {
    // Decide to use calendar or preset durations
    if (calendarDate) {
      return duration(Math.ceil(calendarDate.diff(moment(), "d", true)), "d");
    }
    const days = getDaysFromDurationSelectOption(durationSelectValue);
    if (days !== 0) {
      const newStakeDuration = durationToExpiry
        .clone()
        .add(duration(days, "d"));
      return newStakeDuration;
    }
    return initialStakingData.duration;
  }, [
    initialStakingData.duration,
    calendarDate,
    durationSelectValue,
    durationToExpiry,
  ]);

  const expiryInFuture = useMemo(
    () => expiryMoment.isAfter(moment()),
    [expiryMoment]
  );

  const lockupDurationExceedsMaximum = useMemo(() => {
    const twoYears = duration(2, "y");
    // Stake duration cannot be more than 2 years.
    if (stakeDuration > twoYears) {
      return true;
    }
    return false;
  }, [stakeDuration]);

  return (
    <>
      <StakingModalFormCalendarOverlay
        show={showCalendarPicker}
        onCancel={() => {
          setShowCalendarPicker(false);
          setDurationSelectValue(durationSelectOptions[0]);
        }}
        onDateSelected={(date) => {
          setShowCalendarPicker(false);
          setCalendarDate(date);
        }}
        minDate={expiryMoment.clone().add(7, "d")}
      />
      <BaseModalContentColumn>
        <LogoContainer>
          <StakeIcon size="32px" color={colors.red} />
        </LogoContainer>
      </BaseModalContentColumn>
      <BaseModalContentColumn>
        <Title fontSize={22} lineHeight={28}>
          {t("governance:IncreaseLockTimeModal:increaseYourLockTime")}
        </Title>
      </BaseModalContentColumn>

      {/* Calender Slider */}
      <BaseModalContentColumn className="flex-column">
        <BaseInputLabel className="mb-2">
          {t("governance:IncreaseLockTimeModal:increaseLockTimeBy")}
        </BaseInputLabel>
        <InlineSelectInput
          options={[
            durationSelectOptionsExcludeCustom.map((text) => ({
              value: text,
              display: (active) => (
                <Subtitle
                  fontSize={14}
                  lineHeight={16}
                  letterSpacing={1}
                  color={active ? colors.green : colors.text}
                >
                  {text}
                </Subtitle>
              ),
            })),
            [
              {
                value: "custom",
                display: (active) => (
                  <CalendarIcon
                    width={16}
                    color={active ? colors.green : colors.text}
                  />
                ),
              },
            ],
          ]}
          value={durationSelectValue}
          onValueChange={(value) => {
            setDurationSelectValue(value as DurationSelectOption);
            if (value === "custom") {
              setShowCalendarPicker(true);
            } else {
              setCalendarDate(undefined);
            }
          }}
        />
      </BaseModalContentColumn>
      <BaseModalContentColumn>
        <div className="d-flex justify-content-between w-100">
          <SecondaryText lineHeight={24}>
            {t("governance:IncreaseLockTimeModal:currentLockupExpiry")}
          </SecondaryText>
          <Title
            color={expiryInFuture ? colors.primaryText : colors.red}
            lineHeight={24}
          >
            {expiryMoment.format("MMM, Do YYYY")}
          </Title>
        </div>
      </BaseModalContentColumn>
      <BaseModalContentColumn>
        <div className="d-flex justify-content-between w-100">
          <div className="d-flex align-items-center">
            <SecondaryText lineHeight={24}>
              {t("shared:TooltipExplanations:lockedRBN:title")}
            </SecondaryText>
            <TooltipExplanation
              title={t("shared:TooltipExplanations:lockedRBN:title")}
              explanation={t(
                "shared:TooltipExplanations:lockedRBN:description"
              )}
              renderContent={({ ref, ...triggerHandler }) => (
                <HelpInfo containerRef={ref} {...triggerHandler}>
                  i
                </HelpInfo>
              )}
            />
          </div>
          <Title lineHeight={24}>
            {rbnTokenAccount
              ? formatBigNumber(rbnTokenAccount.lockedBalance, 18)
              : "0"}
          </Title>
        </div>
      </BaseModalContentColumn>
      <BaseModalWarning color={colors.green} marginTop="auto">
        <SecondaryText
          color={`${colors.green}A3`}
          className="w-100 text-center"
          fontWeight={400}
        >
          {lockupDurationExceedsMaximum ? (
            <>
              {`${t(
                "governance:IncreaseLockTimeModal:maximumLockupMessage:1"
              )} `}
              <StakingWarningHighlight>
                {`${t(
                  "governance:IncreaseLockTimeModal:maximumLockupMessage:2"
                )} `}
              </StakingWarningHighlight>
              {`${t(
                "governance:IncreaseLockTimeModal:maximumLockupMessage:3"
              )} `}
            </>
          ) : (
            <>
              {`${t(
                "governance:IncreaseLockTimeModal:lockupSummaryMessage:1"
              )} `}
              <StakingWarningHighlight>
                {moment().add(stakeDuration).format("MMMM, Do YYYY")}
              </StakingWarningHighlight>{" "}
              {`${t(
                "governance:IncreaseLockTimeModal:lockupSummaryMessage:2"
              )} `}
              <StakingWarningHighlight>
                {formatBigNumberAmount(
                  calculateInitialveRBNAmount(
                    rbnTokenAccount?.lockedBalance || BigNumber.from(0),
                    stakeDuration
                  ).sub(
                    calculateInitialveRBNAmount(
                      rbnTokenAccount?.lockedBalance || BigNumber.from(0),
                      durationToExpiry
                    )
                  )
                )}{" "}
                veRBN
              </StakingWarningHighlight>{" "}
              {`${t(
                "governance:IncreaseLockTimeModal:lockupSummaryMessage:3"
              )} `}
              <StakingWarningHighlight>
                {formatBigNumberAmount(
                  calculateInitialveRBNAmount(
                    rbnTokenAccount?.lockedBalance || BigNumber.from(0),
                    stakeDuration
                  )
                )}{" "}
                veRBN
              </StakingWarningHighlight>
            </>
          )}
        </SecondaryText>
      </BaseModalWarning>
      <BaseModalContentColumn>
        <ActionButton
          disabled={!expiryInFuture || lockupDurationExceedsMaximum}
          onClick={() => {
            if (!expiryInFuture) {
              return;
            }

            proceedToPreview(BigNumber.from(0), stakeDuration);
          }}
          className="py-3 mb-3"
          color={colors.red}
        >
          {`${t("governance:IncreaseLockTimeModal:previewLockTimeIncrease")} `}
        </ActionButton>
      </BaseModalContentColumn>
    </>
  );
};

export default StakingModalIncreaseDurationForm;
