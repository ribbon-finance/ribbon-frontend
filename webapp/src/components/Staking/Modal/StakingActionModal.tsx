import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { formatUnits, parseUnits } from "@ethersproject/units";
import { BigNumber } from "@ethersproject/bignumber";
import moment from "moment";

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
  PrimaryText,
  SecondaryText,
  Subtitle,
  Title,
  BaseModalContentColumn,
} from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import { StakingPoolData } from "../../../models/staking";
import { getAssetDecimals } from "shared/lib/utils/asset";
import { formatBigNumber } from "shared/lib/utils/math";
import { ActionButton } from "shared/lib/components/Common/buttons";
import useStakingReward from "../../../hooks/useStakingReward";
import { useWeb3Context } from "shared/lib/hooks/web3Context";
import TrafficLight from "../../Common/TrafficLight";
import usePendingTransactions from "../../../hooks/usePendingTransactions";
import { getVaultColor } from "shared/lib/utils/vault";
import BasicModal from "../../Common/BasicModal";

const FloatingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0 16px;
`;

const ModalTitle = styled(Title)`
  z-index: 2;
`;

const LogoContainer = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 100px;
  background: ${(props) => props.color}29;
  color: ${(props) => props.color};
  font-size: 40px;
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

const InfoColumn = styled(BaseModalContentColumn)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const InfoData = styled(Title)<{ error?: boolean }>`
  text-transform: none;
  ${(props) => {
    if (props.error) {
      return `
        color: ${colors.red};
      `;
    }

    return ``;
  }}
`;

const CurrentStakeTitle = styled(Subtitle)`
  color: ${colors.text};
`;

const PreviewAmount = styled(Title)`
  font-size: 40px;
  line-height: 52px;
`;

const Arrow = styled.i<{ color: string }>`
  font-size: 12px;
  color: ${(props) => props.color};
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
    "warning" | "form" | "preview" | "walletAction" | "processing"
  >("warning");
  const [input, setInput] = useState("");
  const { provider } = useWeb3Context();
  const decimals = getAssetDecimals(getAssets(vaultOption));
  const [error, setError] = useState<
    "insufficient_balance" | "insufficient_staked"
  >();
  const stakingReward = useStakingReward(vaultOption);
  const [, setPendingTransactions] = usePendingTransactions();
  const [txId, setTxId] = useState("");

  const color = getVaultColor(vaultOption);

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
    if (step === "form" || step === "preview" || step === "walletAction") {
      setStep("warning");
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
      setStep("warning");
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
   * Check if it's withdraw and before period end
   */
  useEffect(() => {
    if (
      show &&
      step === "warning" &&
      stakingPoolData.periodFinish &&
      !(!stake && moment(stakingPoolData.periodFinish, "X").diff(moment()) > 0)
    ) {
      setStep("form");
    }
  }, [show, stake, stakingPoolData, step]);

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
      case "warning":
        return (
          <>
            <BaseModalContentColumn>
              <LogoContainer color={colors.red}>!</LogoContainer>
            </BaseModalContentColumn>
            <BaseModalContentColumn marginTop={16}>
              <AssetTitle str="WARNING">WARNING</AssetTitle>
            </BaseModalContentColumn>
            <BaseModalContentColumn marginTop={16}>
              <SecondaryText className="text-center">
                Your RBN rewards will be forfeited if you unstake your tokens
                before the end of the program (
                {moment(stakingPoolData.periodFinish, "X").format(
                  "MMM Do, YYYY"
                )}
                ).
              </SecondaryText>
            </BaseModalContentColumn>
            <BaseModalContentColumn marginTop="auto">
              <ActionButton
                className="btn py-3 mb-3"
                color={color}
                error={true}
                disabled={false}
                onClick={() => setStep("form")}
              >
                Continue
              </ActionButton>
            </BaseModalContentColumn>
          </>
        );
      case "form":
        return (
          <>
            <BaseModalContentColumn>
              <LogoContainer color={color}>{logo}</LogoContainer>
            </BaseModalContentColumn>
            <BaseModalContentColumn marginTop={8}>
              <AssetTitle str={vaultOption}>{vaultOption}</AssetTitle>
            </BaseModalContentColumn>
            <BaseModalContentColumn>
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
            </BaseModalContentColumn>
            {stake ? (
              <InfoColumn>
                <SecondaryText>Unstaked Balance</SecondaryText>
                <InfoData error={Boolean(error)}>
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
                <InfoData error={Boolean(error)}>
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
                <SecondaryText>Pool rewards</SecondaryText>
              </div>
              <InfoData>
                {formatBigNumber(stakingPoolData.poolRewardForDuration, 6, 18)}{" "}
                RBN
              </InfoData>
            </InfoColumn>
            <BaseModalContentColumn marginTop="auto">
              <ActionButton
                className="btn py-3"
                color={color}
                error={Boolean(error)}
                disabled={
                  Boolean(error) || !(Boolean(input) && parseFloat(input) > 0)
                }
                onClick={() => setStep("preview")}
              >
                {renderActionButtonText()}
              </ActionButton>
            </BaseModalContentColumn>
            {stake ? (
              <BaseModalContentColumn marginTop={16} className="mb-2">
                <CurrentStakeTitle>
                  Your Current Stake:{" "}
                  {formatBigNumber(stakingPoolData.currentStake, 4, decimals)}
                </CurrentStakeTitle>
              </BaseModalContentColumn>
            ) : (
              <BaseModalContentColumn marginTop={16} className="mb-2">
                <CurrentStakeTitle>
                  Unstaked Balance:{" "}
                  {formatBigNumber(
                    stakingPoolData.unstakedBalance,
                    4,
                    decimals
                  )}
                </CurrentStakeTitle>
              </BaseModalContentColumn>
            )}
          </>
        );
      case "preview":
        return (
          <>
            <BaseModalContentColumn marginTop={8}>
              <ModalTitle>{stake ? "STAKE" : "UNSTAKE"} PREVIEW</ModalTitle>
            </BaseModalContentColumn>
            <BaseModalContentColumn marginTop={48}>
              <BaseInputLabel>AMOUNT ({vaultOption})</BaseInputLabel>
            </BaseModalContentColumn>
            <BaseModalContentColumn marginTop={4}>
              <PreviewAmount>
                {parseFloat(parseFloat(input).toFixed(4))}
              </PreviewAmount>
            </BaseModalContentColumn>
            <InfoColumn>
              <SecondaryText>Pool</SecondaryText>
              <InfoData>{vaultOption}</InfoData>
            </InfoColumn>
            <InfoColumn>
              <SecondaryText>Your Stake</SecondaryText>
              <InfoData>
                {formatBigNumber(stakingPoolData.currentStake, 4, decimals)}
                <Arrow className="fas fa-arrow-right mx-2" color={color} />
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
              <SecondaryText>Pool rewards</SecondaryText>
              <InfoData>
                {formatBigNumber(stakingPoolData.poolRewardForDuration, 6, 18)}{" "}
                RBN
              </InfoData>
            </InfoColumn>
            <BaseModalContentColumn marginTop="auto">
              <ActionButton
                className="btn py-3 mb-2"
                onClick={handleActionPressed}
                color={color}
              >
                {stake ? "STAKE" : "UNSTAKE"} NOW
              </ActionButton>
            </BaseModalContentColumn>
          </>
        );
      case "walletAction":
      case "processing":
        return (
          <>
            <BaseModalContentColumn marginTop={8}>
              <ModalTitle>
                {step === "walletAction"
                  ? "CONFIRM Transaction"
                  : "TRANSACTION PENDING"}
              </ModalTitle>
            </BaseModalContentColumn>
            <FloatingContainer>
              <TrafficLight active={step === "processing"} />
            </FloatingContainer>
            {step === "walletAction" ? (
              <BaseModalContentColumn marginTop="auto">
                <PrimaryText className="mb-2">
                  Confirm this transaction in your wallet
                </PrimaryText>
              </BaseModalContentColumn>
            ) : (
              <BaseModalContentColumn marginTop="auto">
                <BaseUnderlineLink
                  to={`${getEtherscanURI()}/tx/${txId}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="d-flex"
                >
                  <PrimaryText className="mb-2">View on Etherscan</PrimaryText>
                </BaseUnderlineLink>
              </BaseModalContentColumn>
            )}
          </>
        );
    }
  }, [
    color,
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
    <BasicModal
      show={show}
      onClose={handleClose}
      height={step === "form" ? 564 : 424}
      backButton={
        step === "preview" ? { onClick: () => setStep("form") } : undefined
      }
      animationProps={{
        key: step,
        transition: {
          duration: 0.25,
          type: "keyframes",
          ease: "easeInOut",
        },
        initial:
          step !== "processing"
            ? {
                y: -200,
                opacity: 0,
              }
            : {},
        animate:
          step !== "processing"
            ? {
                y: 0,
                opacity: 1,
              }
            : {},
        exit:
          step === "form" || step === "preview"
            ? {
                y: 200,
                opacity: 0,
              }
            : {},
      }}
      headerBackground={step !== "warning" && step !== "form"}
    >
      {body}
    </BasicModal>
  );
};

export default StakingActionModal;
