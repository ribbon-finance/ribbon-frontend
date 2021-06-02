import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { formatUnits, parseUnits } from "@ethersproject/units";
import { BigNumber } from "@ethersproject/bignumber";
import { Modal } from "react-bootstrap";
import { AnimatePresence, motion } from "framer-motion";

import {
  getAssets,
  getEtherscanURI,
  VaultOptions,
} from "shared/lib/constants/constants";
import {
  BaseInput,
  BaseInputButton,
  BaseInputContianer,
  BaseInputLabel,
  BaseLink,
  BaseModal,
  BaseModalHeader,
  PrimaryText,
  SecondaryText,
  Subtitle,
  Title,
} from "shared/lib/designSystem";
import theme from "shared/lib/designSystem/theme";
import colors from "shared/lib/designSystem/colors";
import MenuButton from "../../Header/MenuButton";
import { StakingPoolData } from "../../../models/staking";
import { getAssetDecimals } from "shared/lib/utils/asset";
import { formatBigNumber } from "shared/lib/utils/math";
import { ActionButton } from "shared/lib/components/Common/buttons";
import useStakingReward from "../../../hooks/useStakingReward";
import { useWeb3Context } from "shared/lib/hooks/web3Context";
import TrafficLight from "../../Common/TrafficLight";

const StyledModal = styled(BaseModal)<{ isForm: boolean }>`
  .modal-dialog {
    max-width: 343px;
    margin-left: auto;
    margin-right: auto;
  }

  .modal-content {
    transition: min-height 0.25s;
    min-height: ${(props) => (props.isForm ? 564 : 424)}px;
    overflow: hidden;
  }
`;

const ModalContent = styled(motion.div)`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  padding: 16px;
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

const FloatingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: -16px;
  left: 0;
  width: 100%;
  height: calc(100%);
  padding: 0 16px;
`;

const ModalHeaderBackground = styled.div`
  background: ${colors.pillBackground};
  height: 72px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  margin-top: -32px;
`;

const ModalTitle = styled(Title)`
  z-index: 2;
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

const InfoData = styled(Title)`
  text-transform: none;
`;

const CurrentStakeTitle = styled(Subtitle)`
  color: ${colors.text};
`;

const PreviewAmount = styled(Title)`
  font-size: 40px;
  line-height: 52px;
`;

const Arrow = styled.i`
  font-size: 12px;
  color: ${colors.buttons.primary};
`;

const UnderlinedLink = styled(BaseLink)`
  text-decoration: underline;
  color: ${colors.text};

  &:hover {
    text-decoration: none;
    color: ${colors.text};
  }
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
  const [step, setStep] = useState<"form" | "preview" | "stake" | "staking">(
    "form"
  );
  const [input, setInput] = useState("");
  const { provider } = useWeb3Context();
  const decimals = getAssetDecimals(getAssets(vaultOption));
  const [error, setError] = useState<"insufficient_balance">();
  const stakingReward = useStakingReward(vaultOption);

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

  const handleClose = useCallback(() => {
    onClose();
    if (step === "preview" || step === "stake") {
      setStep("form");
    }
  }, [step, onClose]);

  const handleStake = useCallback(async () => {
    if (!stakingReward) {
      return;
    }
    setStep("stake");

    try {
      const tx = await stakingReward.stake(parseUnits(input, decimals));

      setStep("staking");

      const txhash = tx.hash;
      // TODO:
      await provider.waitForTransaction(txhash);
      setStep("form");
      onClose();
    } catch (err) {
      setStep("preview");
    }
  }, [decimals, input, provider, stakingReward, onClose]);

  /**
   * Input Validation
   */
  useEffect(() => {
    setError(undefined);

    /** Skip when there is no input */
    if (!input) {
      return;
    }

    /** Check sufficient balance for deposit */
    if (!tokenBalance.gte(BigNumber.from(parseUnits(input, decimals)))) {
      setError("insufficient_balance");
      return;
    }
  }, [decimals, input, tokenBalance]);

  const renderActionButtonText = useCallback(() => {
    switch (error) {
      case "insufficient_balance":
        return "INSUFFICIENT BALANCE";
      default:
        return "STAKE PREVIEW";
    }
  }, [error]);

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
              <InfoData>{formatBigNumber(tokenBalance, 4, decimals)}</InfoData>
            </InfoColumn>
            <InfoColumn>
              <SecondaryText>Pool Size</SecondaryText>
              <InfoData>
                {formatBigNumber(stakingPoolData.poolSize, 4, decimals)}
              </InfoData>
            </InfoColumn>
            <InfoColumn>
              <SecondaryText>Expected Yield (APY)</SecondaryText>
              <InfoData>{stakingPoolData.expectedYield.toFixed(2)}%</InfoData>
            </InfoColumn>
            <ContentColumn marginTop="auto">
              <ActionButton
                className="btn py-3"
                disabled={!!error || !(!!input && parseFloat(input) > 0)}
                onClick={() => setStep("preview")}
              >
                {renderActionButtonText()}
              </ActionButton>
            </ContentColumn>
            <ContentColumn marginTop={16} className="mb-2">
              <CurrentStakeTitle>
                Your Current Stake:{" "}
                {formatBigNumber(stakingPoolData.currentStake, 4, decimals)}
              </CurrentStakeTitle>
            </ContentColumn>
          </>
        );
      case "preview":
        return (
          <>
            <ContentColumn marginTop={-24}>
              <ModalTitle>STAKE PREVIEW</ModalTitle>
            </ContentColumn>
            <ModalHeaderBackground />
            <ContentColumn marginTop={48}>
              <BaseInputLabel>AMOUNT ({vaultOption})</BaseInputLabel>
            </ContentColumn>
            <ContentColumn marginTop={4}>
              <PreviewAmount>
                {parseFloat(parseFloat(input).toFixed(4))}
              </PreviewAmount>
            </ContentColumn>
            <InfoColumn>
              <SecondaryText>Pool</SecondaryText>
              <InfoData>{vaultOption}</InfoData>
            </InfoColumn>
            <InfoColumn>
              <SecondaryText>Your Stake</SecondaryText>
              <InfoData>
                {formatBigNumber(stakingPoolData.currentStake, 4, decimals)}
                <Arrow className="fas fa-arrow-right mx-2" />
                {formatBigNumber(
                  stakingPoolData.currentStake.add(
                    BigNumber.from(parseUnits(input, decimals))
                  ),
                  4,
                  decimals
                )}
              </InfoData>
            </InfoColumn>
            <InfoColumn>
              <SecondaryText>Expected Yield (APY)</SecondaryText>
              <InfoData>{stakingPoolData.expectedYield.toFixed(2)}%</InfoData>
            </InfoColumn>
            <ContentColumn marginTop="auto">
              <ActionButton className="btn py-3 mb-2" onClick={handleStake}>
                STAKE NOW
              </ActionButton>
            </ContentColumn>
          </>
        );
      case "stake":
      case "staking":
        return (
          <>
            <ContentColumn marginTop={-24}>
              <ModalTitle>
                {step === "stake"
                  ? "CONFIRM Transaction"
                  : "TRANSACTION SUBMITTED"}
              </ModalTitle>
            </ContentColumn>
            <ModalHeaderBackground />
            <FloatingContainer>
              <TrafficLight active={step === "staking"} />
            </FloatingContainer>
            {step === "stake" ? (
              <ContentColumn marginTop="auto">
                <PrimaryText className="mb-2">
                  Confirm this transaction in your wallet
                </PrimaryText>
              </ContentColumn>
            ) : (
              <ContentColumn marginTop="auto">
                <UnderlinedLink
                  // TODO:
                  to={`${getEtherscanURI()}/tx/`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="d-flex"
                >
                  <PrimaryText className="mb-2">View on Etherscan</PrimaryText>
                </UnderlinedLink>
              </ContentColumn>
            )}
          </>
        );
    }
  }, [
    decimals,
    error,
    handleInputChange,
    handleMaxPressed,
    handleStake,
    input,
    step,
    logo,
    vaultOption,
    tokenBalance,
    stakingPoolData,
    renderActionButtonText,
  ]);

  return (
    <StyledModal
      show={show}
      onHide={handleClose}
      centered
      backdrop={true}
      isForm={step === "form"}
    >
      <BaseModalHeader>
        <CloseButton role="button" onClick={handleClose}>
          <MenuButton
            isOpen={true}
            onToggle={handleClose}
            size={20}
            color={"#FFFFFFA3"}
          />
        </CloseButton>
      </BaseModalHeader>
      <Modal.Body>
        <AnimatePresence initial={false}>
          <ModalContent
            key={step}
            transition={{
              duration: 0.25,
              type: "keyframes",
              ease: "easeInOut",
            }}
            initial={
              step !== "staking"
                ? {
                    y: -200,
                    opacity: 0,
                  }
                : {}
            }
            animate={
              step !== "staking"
                ? {
                    y: 0,
                    opacity: 1,
                  }
                : {}
            }
            exit={
              step === "form" || step === "preview"
                ? {
                    y: 200,
                    opacity: 0,
                  }
                : {}
            }
          >
            {body}
          </ModalContent>
        </AnimatePresence>
      </Modal.Body>
    </StyledModal>
  );
};

export default StakingActionModal;
