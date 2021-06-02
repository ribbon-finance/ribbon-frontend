import React, { useCallback, useMemo, useRef, useState } from "react";
import styled from "styled-components";

import { getAssets, VaultOptions } from "shared/lib/constants/constants";
import {
  BaseInput,
  BaseInputButton,
  BaseInputContianer,
  BaseInputLabel,
  BaseModal,
  BaseModalHeader,
  SecondaryText,
  Title,
} from "shared/lib/designSystem";
import theme from "shared/lib/designSystem/theme";
import colors from "shared/lib/designSystem/colors";
import MenuButton from "../../Header/MenuButton";
import { Modal } from "react-bootstrap";
import { StakingPoolData } from "../../../models/staking";
import { formatUnits } from "@ethersproject/units";
import { BigNumber } from "@ethersproject/bignumber";
import { getAssetDecimals } from "shared/lib/utils/asset";
import { formatBigNumber } from "shared/lib/utils/math";

const StyledModal = styled(BaseModal)`
  .modal-dialog {
    max-width: 343px;
    margin-left: auto;
    margin-right: auto;
  }

  .modal-content {
    overflow: hidden;
  }
`;

const CloseButton = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: 48px;
  color: ${colors.text};
  z-index: 2;
`;

const ContentColumn = styled.div<{ marginTop?: number | "auto" }>`
  display: flex;
  justify-content: center;
  z-index: 1;
  margin-top: ${(props) =>
    props.marginTop === "auto"
      ? props.marginTop
      : `${props.marginTop || 24}px`};
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 100px;
  background: ${colors.red}29;
`;

const AssetTitle = styled(Title)<{ str: string }>`
  text-transform: none;

  ${(props) =>
    props.str.length > 12
      ? `
    font-size: 24px;
    line-height: 36px;
  `
      : `
    font-size: 40px;
    line-height: 52px;
  `}
`;

const InfoColumn = styled(ContentColumn)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

interface StakingActionModalProps {
  show: boolean;
  onClose: () => void;
  logo: React.ReactNode;
  vaultOption: VaultOptions;
  stakingPoolData: StakingPoolData;
  tokenBalance: BigNumber;
}

const StakingActionModal: React.FC<StakingActionModalProps> = ({
  show,
  onClose,
  logo,
  vaultOption,
  stakingPoolData,
  tokenBalance,
}) => {
  const [step, setStep] = useState<"form">("form");
  const [input, setInput] = useState("");
  const decimals = getAssetDecimals(getAssets(vaultOption));

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawInput = e.target.value;

      // Do not allow user to enter smaller than 0
      if (rawInput && parseFloat(rawInput) < 0) {
        setInput("");
        return;
      }

      setInput(rawInput); // Let's flush out the input changes first.
    },
    []
  );

  const handleMaxPressed = useCallback(() => {
    setInput(formatUnits(tokenBalance, decimals));
  }, [decimals, tokenBalance]);

  const body = useMemo(() => {
    switch (step) {
      case "form":
        return (
          <>
            <ContentColumn marginTop={-8}>
              <LogoContainer>{logo}</LogoContainer>
            </ContentColumn>
            <ContentColumn marginTop={8}>
              <AssetTitle str={vaultOption}>{vaultOption}</AssetTitle>
            </ContentColumn>
            <ContentColumn>
              <div className="d-flex w-100 flex-wrap">
                <BaseInputLabel>AMOUNT ({vaultOption})</BaseInputLabel>
                <BaseInputContianer className="position-relative">
                  <BaseInput
                    type="number"
                    className="form-control"
                    placeholder="0"
                    value={input}
                    onChange={handleInputChange}
                  />
                  <BaseInputButton onClick={handleMaxPressed}>
                    MAX
                  </BaseInputButton>
                </BaseInputContianer>
              </div>
            </ContentColumn>
            <InfoColumn>
              <SecondaryText>Unstaked Balance</SecondaryText>
              <Title>{formatBigNumber(tokenBalance, 6, decimals)}</Title>
            </InfoColumn>
            <InfoColumn>
              <SecondaryText>Pool Size</SecondaryText>
              <Title>
                {formatBigNumber(stakingPoolData.poolSize, 6, decimals)}
              </Title>
            </InfoColumn>
            <InfoColumn>
              <SecondaryText>Expected Yield (APY)</SecondaryText>
              <Title>{stakingPoolData.expectedYield.toFixed(2)}%</Title>
            </InfoColumn>
          </>
        );
    }
  }, [
    decimals,
    handleInputChange,
    handleMaxPressed,
    input,
    step,
    logo,
    vaultOption,
    tokenBalance,
    stakingPoolData,
  ]);

  return (
    <StyledModal show={show} onHide={onClose} centered backdrop={true}>
      <BaseModalHeader>
        <CloseButton role="button" onClick={onClose}>
          <MenuButton
            isOpen={true}
            onToggle={onClose}
            size={20}
            color={"#FFFFFFA3"}
          />
        </CloseButton>
      </BaseModalHeader>
      <Modal.Body>{body}</Modal.Body>
    </StyledModal>
  );
};

export default StakingActionModal;
