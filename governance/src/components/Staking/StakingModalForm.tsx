import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";
import { formatUnits, parseUnits } from "@ethersproject/units";

import {
  BaseInput,
  BaseInputButton,
  BaseInputContainer,
  BaseInputLabel,
  BaseModalContentColumn,
  SecondaryText,
  Subtitle,
  Title,
} from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import { CalendarIcon, StakeIcon } from "shared/lib/assets/icons/icons";
import { useRBNTokenAccount } from "shared/lib/hooks/useRBNTokenSubgraph";
import InlineSelectInput from "shared/lib/components/Common/InlineSelectInput";
import { formatBigNumber } from "shared/lib/utils/math";
import moment, { duration, Duration } from "moment";
import StakingModalFormCalendarOverlay from "./StakingModalFormCalendarOverlay";

const durationSelectOptions = [
  "1W",
  "1M",
  "3M",
  "6M",
  "1Y",
  "4Y",
  "custom",
] as const;
type DurationSelectOption = typeof durationSelectOptions[number];
const durationSelectOptionsExcludeCustom = durationSelectOptions.filter(
  (option) => option !== "custom"
);

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: ${colors.red}1F;
  border-radius: 100px;
`;

interface StakingModalFormProps {}

const StakingModalForm: React.FC<StakingModalFormProps> = ({}) => {
  const { active } = useWeb3React();
  const { data } = useRBNTokenAccount();

  const [showCalendarPicker, setShowCalendarPicker] = useState(false);

  const [amountInput, setAmountInput] = useState("");
  const [durationSelectValue, setDurationSelectValue] =
    useState<DurationSelectOption>(durationSelectOptions[0]);
  const [stakeDuration, setStakeDuration] = useState<Duration>(duration());

  const inputError = useMemo(() => {
    return Boolean(
      amountInput && data && parseUnits(amountInput, 18).gt(data.balance)
    );
  }, [amountInput, data]);

  /**
   * Update stake duration value
   */
  useEffect(() => {
    switch (durationSelectValue) {
      case "1W":
        setStakeDuration(duration(1, "w"));
        break;
      case "1M":
        setStakeDuration(duration(1, "M"));
        break;
      case "3M":
        setStakeDuration(duration(3, "M"));
        break;
      case "6M":
        setStakeDuration(duration(6, "M"));
        break;
      case "1Y":
        setStakeDuration(duration(1, "y"));
        break;
      case "4Y":
        setStakeDuration(duration(4, "y"));
        break;
      case "custom":
        setStakeDuration(duration());
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
          STAKE YOUR RBN
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
                setAmountInput(data ? formatUnits(data.balance) : "0")
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
            {data ? formatBigNumber(data.balance, 18) : "0"}
          </Title>
        </div>
      </BaseModalContentColumn>
    </>
  );
};

export default StakingModalForm;
