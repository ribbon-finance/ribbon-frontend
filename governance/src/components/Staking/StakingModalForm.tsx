import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";
import { formatUnits, parseUnits } from "@ethersproject/units";
import { BigNumber } from "@ethersproject/bignumber";

import {
  BaseInput,
  BaseInputButton,
  BaseInputContainer,
  BaseInputLabel,
  BaseModalContentColumn,
  BaseModalWarning,
  SecondaryText,
  Subtitle,
  Title,
} from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import { CalendarIcon, StakeIcon } from "shared/lib/assets/icons/icons";
import { useRBNTokenAccount } from "shared/lib/hooks/useRBNTokenSubgraph";
import InlineSelectInput from "shared/lib/components/Common/InlineSelectInput";
import { formatBigNumber, formatBigNumberAmount } from "shared/lib/utils/math";
import moment, { duration, Duration } from "moment";
import StakingModalFormCalendarOverlay from "./StakingModalFormCalendarOverlay";
import { calculateInitialveRBNAmount } from "shared/lib/utils/governanceMath";
import { ActionButton } from "shared/lib/components/Common/buttons";

const durationSelectOptions = [
  "1W",
  "1M",
  "3M",
  "6M",
  "1Y",
  "2Y",
  "custom",
] as const;
type DurationSelectOption = typeof durationSelectOptions[number];
const durationSelectOptionsExcludeCustom = durationSelectOptions.filter(
  (option) => option !== "custom"
);

const getDurationSelectOptionFromDuration = (
  duration: Duration
): DurationSelectOption => {
  switch (duration.asDays()) {
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
    case 2 * 365:
      return "2Y";
    default:
      return "custom";
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

interface StakingModalFormProps {
  initialStakingData: {
    amount: BigNumber;
    duration: Duration;
  };
  proceedToPreview: (amount: BigNumber, duration: Duration) => void;
}

const StakingModalForm: React.FC<StakingModalFormProps> = ({
  initialStakingData,
  proceedToPreview,
}) => {
  const { active } = useWeb3React();
  const { data: rbnTokenAccount } = useRBNTokenAccount();

  const [showCalendarPicker, setShowCalendarPicker] = useState(false);

  const [amountInput, setAmountInput] = useState(
    initialStakingData.amount.isZero()
      ? ""
      : formatUnits(initialStakingData.amount)
  );
  const [durationSelectValue, setDurationSelectValue] =
    useState<DurationSelectOption>(
      initialStakingData.duration.asDays() === 0
        ? durationSelectOptions[0]
        : getDurationSelectOptionFromDuration(initialStakingData.duration)
    );
  const [stakeDuration, setStakeDuration] = useState<Duration>(
    initialStakingData.duration
  );

  const inputError = useMemo(() => {
    return Boolean(
      amountInput &&
        parseUnits(amountInput, 18).gt(
          rbnTokenAccount ? rbnTokenAccount.walletBalance : BigNumber.from(0)
        )
    );
  }, [amountInput, rbnTokenAccount]);

  const canProceed = useMemo(() => {
    return amountInput && !inputError && stakeDuration.asDays() >= 7;
  }, [amountInput, inputError, stakeDuration]);

  /**
   * Update stake duration value
   */
  useEffect(() => {
    switch (durationSelectValue) {
      case "1W":
        setStakeDuration(duration(7, "d"));
        break;
      case "1M":
        setStakeDuration(duration(30, "d"));
        break;
      case "3M":
        setStakeDuration(duration(91, "d"));
        break;
      case "6M":
        setStakeDuration(duration(182, "d"));
        break;
      case "1Y":
        setStakeDuration(duration(365, "d"));
        break;
      case "2Y":
        setStakeDuration(duration(2 * 365, "d"));
        break;
    }
  }, [durationSelectValue]);

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
          setStakeDuration(
            duration(Math.ceil(date.diff(moment(), "d", true)), "d")
          );
        }}
      />
      <BaseModalContentColumn>
        <LogoContainer>
          <StakeIcon size="32px" color={colors.red} />
        </LogoContainer>
      </BaseModalContentColumn>
      <BaseModalContentColumn>
        <Title fontSize={22} lineHeight={28}>
          LOCK YOUR RBN
        </Title>
      </BaseModalContentColumn>
      <BaseModalContentColumn className="flex-column">
        <BaseInputLabel>AMOUNT (RBN)</BaseInputLabel>
        <BaseInputContainer error={inputError}>
          <BaseInput
            className="form-control"
            placeholder="0"
            type="number"
            value={amountInput}
            onChange={(e) => setAmountInput(e.target.value)}
            fontSize={32}
            lineHeight={32}
          />
          {active && (
            <BaseInputButton
              onClick={() =>
                setAmountInput(
                  rbnTokenAccount
                    ? formatUnits(rbnTokenAccount.walletBalance)
                    : "0"
                )
              }
            >
              MAX
            </BaseInputButton>
          )}
        </BaseInputContainer>
        {inputError && (
          <SecondaryText
            fontSize={12}
            lineHeight={16}
            color={colors.red}
            className="mt-2"
          >
            Insufficient unstaked RBN balance
          </SecondaryText>
        )}
      </BaseModalContentColumn>
      <BaseModalContentColumn className="flex-column">
        <BaseInputLabel className="mb-2">LOCKUP TIME</BaseInputLabel>
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
            }
          }}
        />
      </BaseModalContentColumn>
      <BaseModalContentColumn>
        <div className="d-flex justify-content-between w-100">
          <SecondaryText lineHeight={24}>Unstaked RBN</SecondaryText>
          <Title
            lineHeight={24}
            color={inputError ? colors.red : colors.primaryText}
          >
            {rbnTokenAccount
              ? formatBigNumber(rbnTokenAccount.walletBalance, 18)
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
          {amountInput ? (
            <>
              Your voting power of{" "}
              <StakingWarningHighlight>
                {formatBigNumberAmount(
                  calculateInitialveRBNAmount(
                    parseUnits(amountInput, 18),
                    stakeDuration
                  )
                )}{" "}
                veRBN
              </StakingWarningHighlight>{" "}
              decays linearly over time and expires on{" "}
              <StakingWarningHighlight>
                {moment().add(stakeDuration).format("MMM, Do YYYY")}
              </StakingWarningHighlight>
            </>
          ) : (
            <>Enter an amount to view your voting power</>
          )}
        </SecondaryText>
      </BaseModalWarning>
      <BaseModalContentColumn marginTop="auto">
        <ActionButton
          disabled={!canProceed}
          onClick={() => {
            if (!canProceed) {
              return;
            }

            proceedToPreview(parseUnits(amountInput, 18), stakeDuration);
          }}
          className="py-3 mb-2"
          color={colors.red}
        >
          Preview Lock
        </ActionButton>
      </BaseModalContentColumn>
    </>
  );
};

export default StakingModalForm;
