import React from "react";
import styled from "styled-components";

import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import ButtonArrow from "shared/lib/components/Common/ButtonArrow";
import {
  BaseInput,
  BaseModalContentColumn,
  BaseUnderlineLink,
  PrimaryText,
  Title,
} from "shared/lib/designSystem";
import { ExternalIcon } from "shared/lib/assets/icons/icons";
import ModalContentExtra from "shared/lib/components/Common/ModalContentExtra";
import { SlippageConfig, SlippageOption, SlippageOptionsList } from "./types";

const HeaderContainer = styled.div`
  position: relative;
  height: 64px;
  padding: 12px 16px;
  background: ${colors.pillBackground};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonContainer = styled.div`
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: 40px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.text};
`;

const HeaderButtonContainer = styled.div`
  position: absolute;
  top: 12px;
  left: 16px;
  width: 100%;
  height: 100%;
`;

const WarningText = styled(PrimaryText)`
  color: ${colors.green};
  font-size: 14px;
  line-height: 20px;
  text-align: center;
`;

const SlippageOptionButton = styled.div<{
  active: boolean;
}>`
  display: flex;
  flex: 1;
  justify-content: center;
  padding: 12px 0px;
  border: ${theme.border.width} ${theme.border.style}
    ${(props) => (props.active ? colors.green : "transparent")};
  background: ${(props) =>
    props.active ? `${colors.green}14` : `${colors.primaryText}14`};
  border-radius: 100px;

  margin: 0px 4px;

  &:first-child {
    margin-left: 16px;
  }

  &:last-child {
    margin-right: 16px;
  }
`;

const SlippageOptionText = styled(Title)<{ active: boolean }>`
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 1px;
  color: ${(props) => (props.active ? colors.primaryText : colors.text)};
`;

const SlippageOptionInput = styled(BaseInput)`
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 1px;
  text-align: right;
`;

interface TokenSwapSettingsProps {
  onClose: () => void;
  slippageConfig: SlippageConfig;
  setSlippageConfig: React.Dispatch<React.SetStateAction<SlippageConfig>>;
}

const TokenSwapSettings: React.FC<TokenSwapSettingsProps> = ({
  onClose,
  slippageConfig,
  setSlippageConfig,
}) => {
  return (
    <>
      {/* Header */}
      <HeaderContainer>
        <Title>Slippage Tolerance</Title>
        <HeaderButtonContainer>
          <ButtonContainer role="button" onClick={onClose}>
            <ButtonArrow isOpen={false} />
          </ButtonContainer>
        </HeaderButtonContainer>
      </HeaderContainer>

      {/* Slippage Form Select Options */}
      <BaseModalContentColumn>
        <div className="d-flex flex-row w-100">
          {SlippageOptionsList.map((slippageValue) => {
            const isActive = slippageValue === slippageConfig.name;
            return (
              <SlippageOptionButton
                active={isActive}
                role="button"
                onClick={() =>
                  setSlippageConfig({
                    name: slippageValue as SlippageOption,
                    value: slippageValue,
                  })
                }
              >
                <SlippageOptionText active={isActive}>
                  {slippageValue.toFixed(1)}%
                </SlippageOptionText>
              </SlippageOptionButton>
            );
          })}
        </div>
      </BaseModalContentColumn>

      {/* Custom slippage input field */}
      <BaseModalContentColumn marginTop={16}>
        <SlippageOptionButton
          active={slippageConfig.name === "custom"}
          role="button"
          onClick={() =>
            setSlippageConfig((currConfig) => ({
              name: "custom",
              value: currConfig.name === "custom" ? currConfig.value : 0,
            }))
          }
          className="px-3"
        >
          <SlippageOptionText active={slippageConfig.name === "custom"}>
            CUSTOM
          </SlippageOptionText>
          <SlippageOptionInput
            type="number"
            className="form-control"
            placeholder="0.5"
            value={
              slippageConfig.name === "custom" && slippageConfig.value
                ? slippageConfig.value.toString()
                : ""
            }
            onChange={(e) => {
              const floatNum = parseFloat(e.target.value);
              setSlippageConfig({
                name: "custom",
                value: isNaN(floatNum) ? 0 : floatNum,
              });
            }}
          />
          <SlippageOptionText active={slippageConfig.name === "custom"}>
            %
          </SlippageOptionText>
        </SlippageOptionButton>
      </BaseModalContentColumn>

      {/* Links */}
      <BaseModalContentColumn marginTop="auto">
        <BaseUnderlineLink
          to="https://ribbonfinance.medium.com/rbn-airdrop-distribution-70b6cb0b870c"
          target="_blank"
          rel="noreferrer noopener"
          className="d-flex align-items-center"
        >
          <PrimaryText>Swap tokens on Balancer</PrimaryText>
          <ExternalIcon className="ml-1" color={colors.primaryText} />
        </BaseUnderlineLink>
      </BaseModalContentColumn>

      {/* Notes */}
      <div className="d-flex flex-column px-3 pb-3">
        <ModalContentExtra backgroundColor={`${colors.green}0A`}>
          <WarningText>
            IMPORTANT: If the price changes unfavorably by more than the
            percentage specified above the trade will not be executed.
          </WarningText>
        </ModalContentExtra>
      </div>
    </>
  );
};

export default TokenSwapSettings;
