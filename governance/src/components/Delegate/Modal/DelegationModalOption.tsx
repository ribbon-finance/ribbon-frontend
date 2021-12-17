import React, { useState } from "react";
import styled from "styled-components";

import {
  BaseModalContentColumn,
  BaseModalWarning,
  SecondaryText,
  Title,
} from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import { ActionButton } from "shared/lib/components/Common/buttons";

const SelectOption = styled.div<{ active: boolean }>`
  display: flex;
  width: 100%;
  transition: 0.25s all ease-out;
  padding: 12px 24px;
  background: ${(props) =>
    props.active ? `${colors.green}1F` : colors.background.three};
  border: ${theme.border.width} ${theme.border.style}
    ${(props) => `${colors.green}${props.active ? "FF" : "00"}`};
  border-radius: 100px;

  &:hover {
    ${(props) =>
      !props.active
        ? `
            opacity: ${theme.hover.opacity};
          `
        : ""}
  }
`;

interface DelegationModalOptionProps {
  onDelegateSelf: () => void;
  onDelegateOthers: () => void;
}

const DelegationModalOption: React.FC<DelegationModalOptionProps> = ({
  onDelegateSelf,
  onDelegateOthers,
}) => {
  const [delegateOption, setDelegateOption] = useState<"self" | "others">(
    "self"
  );

  return (
    <>
      {/* Title & Subtitle */}
      <BaseModalContentColumn marginTop={16}>
        <Title fontSize={22} lineHeight={28}>
          DELEGATE YOUR VOTES
        </Title>
      </BaseModalContentColumn>
      <BaseModalContentColumn marginTop={8}>
        <SecondaryText className="text-center">
          Your sRBN enables you to vote on Ribbon governance proposals. You can
          delegate your voting power to yourself or to another Ethereum address.
        </SecondaryText>
      </BaseModalContentColumn>

      {/* Choices */}
      {(
        [
          { value: "self", buttonText: "DELEGATE TO SELF" },
          { value: "others", buttonText: "DELEAGTE TO OTHER Address" },
        ] as { value: "self" | "others"; buttonText: string }[]
      ).map((optionItem, index) => (
        <BaseModalContentColumn marginTop={index === 0 ? 24 : 16}>
          <SelectOption
            role="button"
            active={delegateOption === optionItem.value}
            onClick={() => setDelegateOption(optionItem.value)}
          >
            <Title
              color={
                delegateOption === optionItem.value
                  ? colors.green
                  : colors.primaryText
              }
              fontSize={14}
              lineHeight={24}
              letterSpacing={1}
            >
              {optionItem.buttonText}
            </Title>
          </SelectOption>
        </BaseModalContentColumn>
      ))}

      <BaseModalContentColumn>
        <ActionButton
          className="btn py-3"
          onClick={() =>
            delegateOption === "self" ? onDelegateSelf() : onDelegateOthers()
          }
          color={colors.red}
        >
          {delegateOption === "self" ? "DELEGATE" : "NEXT"}
        </ActionButton>
      </BaseModalContentColumn>

      <BaseModalWarning color={colors.green}>
        <SecondaryText color={colors.green} className="text-center">
          If you delegate your voting rights to another address you will still
          remain in control of your sRBN. Learn more
        </SecondaryText>
      </BaseModalWarning>
    </>
  );
};

export default DelegationModalOption;
