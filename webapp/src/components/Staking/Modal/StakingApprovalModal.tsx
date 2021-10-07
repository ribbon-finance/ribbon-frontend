import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";

import {
  BaseUnderlineLink,
  PrimaryText,
  Title,
  BaseModalContentColumn,
} from "shared/lib/designSystem";
import {
  getEtherscanURI,
  VaultLiquidityMiningMap,
  VaultOptions,
} from "shared/lib/constants/constants";
import StakingApprovalModalInfo from "./StakingApprovalModalInfo";
import TrafficLight from "shared/lib/components/Common/TrafficLight";
import { useWeb3Context } from "shared/lib/hooks/web3Context";
import usePendingTransactions from "../../../hooks/usePendingTransactions";
import useERC20Token from "shared/lib/hooks/useERC20Token";
import { StakingPoolResponse } from "shared/lib/models/staking";
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

interface StakingApprovalModalProps {
  show: boolean;
  onClose: () => void;
  stakingPoolData: StakingPoolResponse;
  vaultOption: VaultOptions;
}

const StakingApprovalModal: React.FC<StakingApprovalModalProps> = ({
  show,
  onClose,
  stakingPoolData,
  vaultOption,
}) => {
  const { provider } = useWeb3Context();
  const [, setPendingTransactions] = usePendingTransactions();
  const tokenContract = useERC20Token(vaultOption);
  const [step, setStep] = useState<"info" | "approve" | "approving">("info");
  const [txId, setTxId] = useState("");

  const handleApprove = useCallback(async () => {
    if (!tokenContract) {
      return;
    }

    setStep("approve");
    const amount =
      "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

    try {
      const tx = await tokenContract.approve(
        VaultLiquidityMiningMap[vaultOption],
        amount
      );

      setStep("approving");

      const txhash = tx.hash;

      setTxId(txhash);
      setPendingTransactions((pendingTransactions) => [
        ...pendingTransactions,
        {
          txhash,
          type: "stakingApproval",
          amount: amount,
          stakeAsset: vaultOption,
        },
      ]);

      // Wait for transaction to be approved
      await provider.waitForTransaction(txhash, 5);
      setStep("info");
      setTxId("");
      onClose();
    } catch (err) {
      setStep("info");
    }
  }, [onClose, tokenContract, provider, setPendingTransactions, vaultOption]);

  const handleClose = useCallback(() => {
    onClose();
    if (step === "approve") {
      setStep("info");
    }
  }, [step, onClose]);

  const body = useMemo(() => {
    switch (step) {
      case "info":
        return (
          <StakingApprovalModalInfo
            vaultOption={vaultOption}
            stakingPoolData={stakingPoolData}
            onApprove={() => {
              handleApprove();
            }}
          />
        );
      case "approve":
      case "approving":
        return (
          <>
            <BaseModalContentColumn marginTop={8}>
              <Title>
                {step === "approve"
                  ? "CONFIRM Approval"
                  : "TRANSACTION PENDING"}
              </Title>
            </BaseModalContentColumn>
            <FloatingContainer>
              <TrafficLight active={step === "approving"} />
            </FloatingContainer>
            {step === "approve" ? (
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
  }, [step, vaultOption, handleApprove, txId, stakingPoolData]);

  const modalHeight = useMemo(() => {
    if (step === "info") {
      return stakingPoolData.unstakedBalance.isZero() ? 476 : 504;
    }

    return 424;
  }, [stakingPoolData, step]);

  return (
    <BasicModal
      show={show}
      onClose={handleClose}
      height={modalHeight}
      animationProps={{
        key: step,
        transition: {
          duration: 0.25,
          type: "keyframes",
          ease: "easeInOut",
        },
        initial:
          step === "info" || step === "approve"
            ? {
                y: -200,
                opacity: 0,
              }
            : {},
        animate:
          step === "info" || step === "approve"
            ? {
                y: 0,
                opacity: 1,
              }
            : {},
        exit:
          step === "info"
            ? {
                y: 200,
                opacity: 0,
              }
            : {},
      }}
      headerBackground={step !== "info"}
    >
      {body}
    </BasicModal>
  );
};

export default StakingApprovalModal;
