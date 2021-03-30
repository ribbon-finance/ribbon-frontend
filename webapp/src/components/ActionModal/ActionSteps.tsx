import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { BigNumber } from "ethers";

import { ActionParams, ACTIONS, ActionType } from "./types";

import useVault from "../../hooks/useVault";
import PreviewStep from "./PreviewStep";
import ConfirmationStep from "./ConfirmationStep";
import SubmittedStep from "./SubmittedStep";

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

export interface ActionStepsProps {
  actionType: ActionType;
  show: boolean;
  onClose: () => void;
  onChangeTitle: (title: string) => void;
  amount: BigNumber;
  positionAmount: BigNumber;
  actionParams: ActionParams;
}

const ActionSteps: React.FC<ActionStepsProps> = ({
  actionType,
  show,
  onClose,
  onChangeTitle,
  amount,
  positionAmount,
  actionParams,
}) => {
  const [step, setStep] = useState<Steps>(STEPS.previewStep);
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

  useEffect(() => {
    onChangeTitle(titles[step]);
  }, [step, onChangeTitle]);

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

  return <div>{stepComponents[step]}</div>;
};

export default ActionSteps;
