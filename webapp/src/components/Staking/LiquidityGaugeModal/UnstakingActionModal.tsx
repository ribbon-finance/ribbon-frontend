import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { formatUnits, parseUnits } from "@ethersproject/units";
import { BigNumber } from "@ethersproject/bignumber";

import {
  BLOCKCHAIN_EXPLORER_NAME,
  getAssets,
  getEtherscanURI,
  VaultOptions,
} from "shared/lib/constants/constants";
import { useWeb3Wallet } from "../../../hooks/useWeb3Wallet";
import { LiquidityGaugeV5PoolResponse } from "shared/lib/models/staking";
import {
  BaseInput,
  BaseInputButton,
  BaseInputContainer,
  BaseInputLabel,
  BaseUnderlineLink,
  PrimaryText,
  SecondaryText,
  BaseModalContentColumn,
  Title,
} from "shared/lib/designSystem";
import { useWeb3Context } from "shared/lib/hooks/web3Context";
import { getAssetDecimals } from "shared/lib/utils/asset";
import useLiquidityGaugeV5 from "shared/lib/hooks/useLiquidityGaugeV5";
import colors from "shared/lib/designSystem/colors";
import { usePendingTransactions } from "shared/lib/hooks/pendingTransactionsContext";
import { getVaultColor } from "shared/lib/utils/vault";
import { formatBigNumber } from "shared/lib/utils/math";
import { ActionButton } from "shared/lib/components/Common/buttons";
import TrafficLight from "shared/lib/components/Common/TrafficLight";
import BasicModal from "shared/lib/components/Common/BasicModal";

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

const AssetTitle = styled(Title)`
  text-transform: none;
  font-size: 22px;
  line-height: 28px;
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

interface UnstakingActionModalProps {
  show: boolean;
  onClose: () => void;
  logo: React.ReactNode;
  vaultOption: VaultOptions;
  stakingPoolData?: LiquidityGaugeV5PoolResponse;
}

const UnstakingActionModal: React.FC<UnstakingActionModalProps> = ({
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
  const { chainId } = useWeb3Wallet();
  const { provider } = useWeb3Context();
  const decimals = getAssetDecimals(getAssets(vaultOption));
  const [error, setError] = useState<"insufficient_staked">();
  const contract = useLiquidityGaugeV5(vaultOption);
  const { addPendingTransaction } = usePendingTransactions();
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

  const handleMaxPressed = useCallback(() => {
    if (stakingPoolData) {
      setInput(formatUnits(stakingPoolData.currentStake, decimals));
    }
  }, [decimals, stakingPoolData]);

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
    if (!contract) {
      return;
    }
    setStep("walletAction");

    try {
      const tx = await contract["withdraw(uint256)"](
        parseUnits(input, decimals)
      );

      setStep("processing");

      const txhash = tx.hash;

      setTxId(txhash);
      addPendingTransaction({
        txhash,
        type: "unstake",
        amount: input,
        stakeAsset: vaultOption,
      });

      await provider.waitForTransaction(txhash, 5);
      setStep("form");
      setTxId("");
      setInput("");
      onClose();
    } catch (err) {
      console.log(err);
      setStep("preview");
    }
  }, [
    addPendingTransaction,
    decimals,
    input,
    provider,
    contract,
    onClose,
    vaultOption,
  ]);

  /**
   * Set to max amount by default
   */
  useEffect(() => {
    if (show) {
      handleMaxPressed();
    }
  }, [handleMaxPressed, show, stakingPoolData, step]);

  /**
   * Input Validation
   */
  useEffect(() => {
    setError(undefined);

    /** Skip when there is no input */
    if (!input) {
      return;
    }

    if (
      !stakingPoolData ||
      !stakingPoolData.currentStake.gte(
        BigNumber.from(parseUnits(input, decimals))
      )
    ) {
      setError("insufficient_staked");
    }
  }, [decimals, input, stakingPoolData]);

  const renderActionButtonText = useCallback(() => {
    switch (error) {
      case "insufficient_staked":
        return "INSUFFICIENT STAKED BALANCE";
      default:
        return "PREVIEW UNSTAKE";
    }
  }, [error]);

  const body = useMemo(() => {
    switch (step) {
      case "form":
        return (
          <>
            <BaseModalContentColumn>
              <LogoContainer color={color}>{logo}</LogoContainer>
            </BaseModalContentColumn>
            <BaseModalContentColumn marginTop={16}>
              <AssetTitle>{vaultOption}</AssetTitle>
            </BaseModalContentColumn>
            <BaseModalContentColumn>
              <div className="d-flex w-100 flex-wrap">
                <BaseInputLabel>AMOUNT ({vaultOption})</BaseInputLabel>
                <BaseInputContainer>
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
                </BaseInputContainer>
              </div>
            </BaseModalContentColumn>

            <InfoColumn>
              <SecondaryText>Staked Balance</SecondaryText>
              <InfoData error={Boolean(error)}>
                {stakingPoolData
                  ? formatBigNumber(stakingPoolData.currentStake, decimals)
                  : 0}
              </InfoData>
            </InfoColumn>

            <BaseModalContentColumn>
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
          </>
        );
      case "preview":
        return (
          <>
            <BaseModalContentColumn>
              <LogoContainer color={color}>{logo}</LogoContainer>
            </BaseModalContentColumn>
            <BaseModalContentColumn marginTop={16}>
              <AssetTitle>UNSTAKE PREVIEW</AssetTitle>
            </BaseModalContentColumn>
            <InfoColumn>
              <SecondaryText>Pool</SecondaryText>
              <InfoData>{vaultOption}</InfoData>
            </InfoColumn>
            <InfoColumn>
              <SecondaryText>Unstake Amount</SecondaryText>
              <InfoData>{parseFloat(parseFloat(input).toFixed(4))}</InfoData>
            </InfoColumn>

            <BaseModalContentColumn marginTop="auto">
              <ActionButton
                className="btn py-3 mb-2"
                onClick={handleActionPressed}
                color={color}
              >
                UNSTAKE NOW
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
                {chainId && (
                  <BaseUnderlineLink
                    to={`${getEtherscanURI(chainId)}/tx/${txId}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="d-flex"
                  >
                    <PrimaryText className="mb-2">
                      View on {BLOCKCHAIN_EXPLORER_NAME[chainId]}
                    </PrimaryText>
                  </BaseUnderlineLink>
                )}
              </BaseModalContentColumn>
            )}
          </>
        );
    }
  }, [
    chainId,
    color,
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
      height={step === "preview" ? 348 : 424}
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
      headerBackground={step !== "form" && step !== "preview"}
    >
      {body}
    </BasicModal>
  );
};

export default UnstakingActionModal;
