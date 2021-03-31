import React, { CSSProperties, useEffect, useState } from "react";
import { BigNumber } from "ethers";

import {
  ActionParams,
  ACTIONS,
  ActionType,
  MobileNavigationButtonTypes,
  PreviewStepProps,
  StepData,
  Steps,
  STEPS,
} from "./types";

import useVault from "../../hooks/useVault";
import PreviewStep from "./PreviewStep";
import ConfirmationStep from "./ConfirmationStep";
import SubmittedStep from "./SubmittedStep";

export interface ActionStepsProps {
  show: boolean;
  onClose: () => void;
  onChangeStep: (stepData: StepData) => void;
  skipToPreview?: boolean;
  previewStepProps?: PreviewStepProps;
  style?: CSSProperties;
  className?: string;
}

const ActionSteps: React.FC<ActionStepsProps> = ({
  show,
  onClose,
  onChangeStep,
  skipToPreview = false,
  previewStepProps,
  className = "",
  style = {},
}) => {
  const [step, setStep] = useState<Steps>(STEPS.previewStep);
  const [txhash, setTxhash] = useState("");
  const vault = useVault();

  const [actionType, setActionType] = useState<ActionType>(
    skipToPreview && previewStepProps ? previewStepProps.actionType : "deposit"
  );
  const [amount, setAmount] = useState<BigNumber>(BigNumber.from("0"));
  const [positionAmount, setPositionAmount] = useState<BigNumber>(
    BigNumber.from("0")
  );
  const [actionParams, setActionParams] = useState<ActionParams>({
    action: "deposit",
    yield: 0,
  });

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

  const amountStr = amount.toString();

  // Update with previewStepProps
  useEffect(() => {
    if (previewStepProps) {
      setActionType(previewStepProps.actionType);
      setAmount(previewStepProps.amount);
      setPositionAmount(previewStepProps.positionAmount);
      setActionParams(previewStepProps.actionParams);
    }
  }, [previewStepProps]);

  useEffect(() => {
    if (vault) {
      (async () => {
        const shares = await vault.assetAmountToShares(amountStr);
        setShares(shares);
      })();
    }
  }, [amountStr, vault]);

  const handleClickConfirmButton = async () => {
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
      } catch (e) {
        console.error(e);
        onClose();
      }
    }
  };

  useEffect(() => {
    const titles = {
      [STEPS.formStep]: "",
      [STEPS.previewStep]: `${actionWord} Preview`,
      [STEPS.confirmationStep]: "Confirm Transaction",
      [STEPS.submittedStep]: "Transaction Submitted",
    };

    const navigationButtons: Record<Steps, MobileNavigationButtonTypes> = {
      [STEPS.formStep]: "back",
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
    0: <div></div>,
    1: (
      <PreviewStep
        {...(previewStepProps || {
          actionType,
          amount,
          positionAmount,
          actionParams,
        })}
        onClickConfirmButton={handleClickConfirmButton}
      ></PreviewStep>
    ),
    2: <ConfirmationStep></ConfirmationStep>,
    3: <SubmittedStep txhash={txhash}></SubmittedStep>,
  };

  return (
    <div className={className} style={style}>
      {stepComponents[step]}
    </div>
  );
};

export default ActionSteps;
