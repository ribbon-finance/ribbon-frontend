import React, { useEffect, useState } from "react";
import { BigNumber } from "ethers";

import {
  ActionParams,
  ACTIONS,
  ActionType,
  MobileNavigationButtonTypes,
  StepData,
  Steps,
  STEPS,
} from "./types";

import useVault from "../../hooks/useVault";
import PreviewStep from "./PreviewStep";
import ConfirmationStep from "./ConfirmationStep";
import SubmittedStep from "./SubmittedStep";

export interface ActionStepsProps {
  actionType: ActionType;
  show: boolean;
  onClose: () => void;
  onChangeStep: (stepData: StepData) => void;
  amount: BigNumber;
  positionAmount: BigNumber;
  actionParams: ActionParams;
}

const ActionSteps: React.FC<ActionStepsProps> = ({
  actionType,
  show,
  onClose,
  onChangeStep,
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

  useEffect(() => {
    const titles = {
      [STEPS.previewStep]: `${actionWord} Preview`,
      [STEPS.confirmationStep]: "Confirm Transaction",
      [STEPS.submittedStep]: "Transaction Submitted",
    };

    const navigationButtons: Record<Steps, MobileNavigationButtonTypes> = {
      [STEPS.previewStep]: "back",
      [STEPS.confirmationStep]: "close",
      [STEPS.submittedStep]: "close",
    };

    onChangeStep({
      title: titles[step],
      stepNum: step,
      navigationButton: navigationButtons[step],
    });
  }, [step, onChangeStep, actionWord]);

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
