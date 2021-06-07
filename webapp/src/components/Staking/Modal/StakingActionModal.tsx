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
  BaseUnderlineLink,
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
import usePendingTransactions from "../../../hooks/usePendingTransactions";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import HelpInfo from "../../Common/HelpInfo";

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

interface StakingActionModalProps {
  stake: boolean;
  show: boolean;
  onClose: () => void;
  logo: React.ReactNode;
  vaultOption: VaultOptions;
  stakingPoolData: StakingPoolData;
}

const StakingActionModal: React.FC<StakingActionModalProps> = ({
  stake,
  show,
  onClose,
  logo,
  vaultOption,
  stakingPoolData,
}) => {
  const [step, setStep] = useState<
    "form" | "preview" | "walletAction" | "processing"
  >("form");
  const [input, setInput] = useState("");
  const { provider } = useWeb3Context();
  const decimals = getAssetDecimals(getAssets(vaultOption));
  const [error, setError] = useState<
    "insufficient_balance" | "insufficient_staked"
  >();
  const stakingReward = useStakingReward(vaultOption);
  const [, setPendingTransactions] = usePendingTransactions();
  const [txId, setTxId] = useState("");

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

  const handleMaxPressed = useCallback(
    () =>
      stake
        ? setInput(formatUnits(stakingPoolData.unstakedBalance, decimals))
        : setInput(formatUnits(stakingPoolData.currentStake, decimals)),
    [stake, decimals, stakingPoolData]
  );

  const handleClose = useCallback(() => {
    onClose();
    if (step === "preview" || step === "walletAction") {
      setStep("form");
    }
    if (step !== "processing") {
      setInput("");
    }
  }, [step, onClose]);

  const handleActionPressed = useCallback(async () => {
    if (!stakingReward) {
      return;
    }
    setStep("walletAction");

    try {
      const tx = stake
        ? await stakingReward.stake(parseUnits(input, decimals))
        : await stakingReward.withdraw(parseUnits(input, decimals));

      setStep("processing");

      const txhash = tx.hash;

      setTxId(txhash);
      setPendingTransactions((pendingTransactions) => [
        ...pendingTransactions,
        {
          txhash,
          type: stake ? "stake" : "unstake",
          amount: input,
          stakeAsset: vaultOption,
        },
      ]);

      await provider.waitForTransaction(txhash);
      setStep("form");
      setTxId("");
      setInput("");
      onClose();
    } catch (err) {
      setStep("preview");
    }
  }, [
    decimals,
    input,
    provider,
    stakingReward,
    onClose,
    setPendingTransactions,
    vaultOption,
    stake,
  ]);

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
    if (
      stake &&
      !stakingPoolData.unstakedBalance.gte(
        BigNumber.from(parseUnits(input, decimals))
      )
    ) {
      setError("insufficient_balance");
    } else if (
      !stake &&
      !stakingPoolData.currentStake.gte(
        BigNumber.from(parseUnits(input, decimals))
      )
    ) {
      setError("insufficient_staked");
    }
  }, [decimals, input, stake, stakingPoolData]);

  const renderActionButtonText = useCallback(() => {
    switch (error) {
      case "insufficient_balance":
        return "INSUFFICIENT BALANCE";
      case "insufficient_staked":
        return "INSUFFICIENT STAKED BALANCE";
      default:
        return stake ? "STAKE PREVIEW" : "UNSTAKE PREVIEW";
    }
  }, [stake, error]);

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
            {stake ? (
              <InfoColumn>
                <SecondaryText>Unstaked Balance</SecondaryText>
                <InfoData>
                  {formatBigNumber(
                    stakingPoolData.unstakedBalance,
                    4,
                    decimals
                  )}
                </InfoData>
              </InfoColumn>
            ) : (
              <InfoColumn>
                <SecondaryText>Your Current Stake</SecondaryText>
                <InfoData>
                  {formatBigNumber(stakingPoolData.currentStake, 4, decimals)}
                </InfoData>
              </InfoColumn>
            )}
            <InfoColumn>
              <SecondaryText>Pool Size</SecondaryText>
              <InfoData>
                {formatBigNumber(stakingPoolData.poolSize, 4, decimals)}
              </InfoData>
            </InfoColumn>
            <InfoColumn>
              <div className="d-flex align-items-center">
                <SecondaryText>Expected Yield (APY)</SecondaryText>
                <TooltipExplanation
                  title="EXPECTED YIELD (APY)"
                  explanation={`By staking your ${vaultOption} tokens in the pool, you earn weekly $RBN rewards.`}
                  renderContent={({ ref, ...triggerHandler }) => (
                    <HelpInfo containerRef={ref} {...triggerHandler}>
                      i
                    </HelpInfo>
                  )}
                  learnMoreURL="https://ribbon.finance/faq"
                />
              </div>
              <InfoData>{stakingPoolData.expectedYield.toFixed(2)}%</InfoData>
            </InfoColumn>
            <ContentColumn marginTop="auto">
              <ActionButton
                className="btn py-3"
                disabled={
                  Boolean(error) || !(Boolean(input) && parseFloat(input) > 0)
                }
                onClick={() => setStep("preview")}
              >
                {renderActionButtonText()}
              </ActionButton>
            </ContentColumn>
            {stake ? (
              <ContentColumn marginTop={16} className="mb-2">
                <CurrentStakeTitle>
                  Your Current Stake:{" "}
                  {formatBigNumber(stakingPoolData.currentStake, 4, decimals)}
                </CurrentStakeTitle>
              </ContentColumn>
            ) : (
              <ContentColumn marginTop={16} className="mb-2">
                <CurrentStakeTitle>
                  Unstaked Balance:{" "}
                  {formatBigNumber(
                    stakingPoolData.unstakedBalance,
                    4,
                    decimals
                  )}
                </CurrentStakeTitle>
              </ContentColumn>
            )}
          </>
        );
      case "preview":
        return (
          <>
            <ContentColumn marginTop={-24}>
              <ModalTitle>{stake ? "STAKE" : "UNSTAKE"} PREVIEW</ModalTitle>
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
                  stake
                    ? stakingPoolData.currentStake.add(
                        BigNumber.from(parseUnits(input, decimals))
                      )
                    : stakingPoolData.currentStake.sub(
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
              <ActionButton
                className="btn py-3 mb-2"
                onClick={handleActionPressed}
              >
                {stake ? "STAKE" : "UNSTAKE"} NOW
              </ActionButton>
            </ContentColumn>
          </>
        );
      case "walletAction":
      case "processing":
        return (
          <>
            <ContentColumn marginTop={-24}>
              <ModalTitle>
                {step === "walletAction"
                  ? "CONFIRM Transaction"
                  : "TRANSACTION SUBMITTED"}
              </ModalTitle>
            </ContentColumn>
            <ModalHeaderBackground />
            <FloatingContainer>
              <TrafficLight active={step === "processing"} />
            </FloatingContainer>
            {step === "walletAction" ? (
              <ContentColumn marginTop="auto">
                <PrimaryText className="mb-2">
                  Confirm this transaction in your wallet
                </PrimaryText>
              </ContentColumn>
            ) : (
              <ContentColumn marginTop="auto">
                <BaseUnderlineLink
                  to={`${getEtherscanURI()}/tx/${txId}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="d-flex"
                >
                  <PrimaryText className="mb-2">View on Etherscan</PrimaryText>
                </BaseUnderlineLink>
              </ContentColumn>
            )}
          </>
        );
    }
  }, [
    stake,
    decimals,
    error,
    handleInputChange,
    handleMaxPressed,
    handleActionPressed,
    input,
    step,
    logo,
    txId,
    vaultOption,
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
              step !== "processing"
                ? {
                    y: -200,
                    opacity: 0,
                  }
                : {}
            }
            animate={
              step !== "processing"
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
