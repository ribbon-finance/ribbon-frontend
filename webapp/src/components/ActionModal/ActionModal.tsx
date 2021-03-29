import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import { BigNumber } from "ethers";

import { BaseModal, BaseModalHeader, Title } from "../../designSystem";
import { ActionParams, ACTIONS, ActionType } from "./types";

import useVault from "../../hooks/useVault";
import PreviewStep from "./PreviewStep";
import ConfirmationStep from "./ConfirmationStep";
import SubmittedStep from "./SubmittedStep";

const ActionModalHeader = styled(BaseModalHeader)`
  background: #151413;
  justify-content: center;
`;

const ModalTitle = styled(Title)`
  flex: 1;
  text-align: center;
`;

const ModalBody = styled(Modal.Body)`
  min-height: 450px;
  max-height: 450px;
`;

const CloseButton = styled.i`
  flex: 0;
  paddingright: 20px;
`;

type PreviewStepType = 0;
type ConfirmationStepType = 1;
type SubmittedStepType = 2;
type Steps = PreviewStepType | ConfirmationStepType | SubmittedStepType;

const STEPS: {
  previewStep: PreviewStepType;
  confirmationStep: ConfirmationStepType;
  submittedStep: SubmittedStepType;
} = {
  previewStep: 0,
  confirmationStep: 1,
  submittedStep: 2,
};

const ActionModal: React.FC<{
  actionType: ActionType;
  show: boolean;
  onClose: () => void;
  amount: BigNumber;
  positionAmount: BigNumber;
  actionParams: ActionParams;
}> = ({ actionType, show, onClose, amount, positionAmount, actionParams }) => {
  const [step, setStep] = useState<Steps>(STEPS.submittedStep);
  const [txhash, setTxhash] = useState("");
  const vault = useVault();

  // We need to pre-fetch the number of shares that the user wants to withdraw
  const [shares, setShares] = useState<BigNumber>(BigNumber.from("0"));

  const isDeposit = actionType === ACTIONS.deposit;
  const actionWord = isDeposit ? "Deposit" : "Withdrawal";

  // Whenever the `show` variable is toggled, we need to reset the step back to 0
  useEffect(() => {
    // small timeout so it doesn't flicker
    setTimeout(() => {
      setStep(STEPS.previewStep);
    }, 500);
  }, [show, setStep]);

  useEffect(() => {
    if (vault) {
      (async () => {
        const shares = await vault.assetAmountToShares(amount);
        setShares(shares);
      })();
    }
  }, [amount, vault]);

  const handleClickActionButton = async () => {
    if (vault !== null) {
      setStep(STEPS.confirmationStep);
      try {
        if (isDeposit) {
          const res = await vault.depositETH({ value: amount });
          setTxhash(res.hash);
          setStep(STEPS.submittedStep);
        } else {
          const res = await vault.withdrawETH(shares);
          setTxhash(res.hash);
          setStep(STEPS.submittedStep);
        }
      } catch (_) {
        onClose();
      }
    }
  };

  const titles = {
    0: `${actionWord} Preview`,
    1: "Confirm Transaction",
    2: "Transaction Submitted",
  };

  const stepComponents = {
    0: (
      <PreviewStep
        actionType={actionType}
        amount={amount}
        positionAmount={positionAmount}
        actionParams={actionParams}
        onClickActionButton={handleClickActionButton}
      ></PreviewStep>
    ),
    1: <ConfirmationStep></ConfirmationStep>,
    2: <SubmittedStep txhash={txhash}></SubmittedStep>,
  };

  return (
    <BaseModal show={show} onHide={onClose} centered>
      <ActionModalHeader closeButton={false}>
        <ModalTitle>{titles[step]}</ModalTitle>

        <CloseButton
          onClick={onClose}
          className="fas fa-times align-self-center text-white"
        ></CloseButton>
      </ActionModalHeader>

      <ModalBody className="d-flex flex-column align-items-center justify-items-center">
        {stepComponents[step]}
      </ModalBody>
    </BaseModal>
  );
};

export default ActionModal;
