import React, { useCallback, useEffect, useState } from "react";
import { BigNumber } from "ethers";

import {
  ActionParams,
  ACTIONS,
  ActionType,
  PreviewStepProps,
  StepData,
  Steps,
  STEPS,
} from "./types";

import useVault from "shared/lib/hooks/useVault";
import PreviewStep from "./PreviewStep";
import TransactionStep from "./TransactionStep";
import FormStep from "./FormStep";
import usePendingTransactions from "../../hooks/usePendingTransactions";
import { getAssets, VaultOptions } from "shared/lib/constants/constants";
import { isETHVault } from "shared/lib/utils/vault";

export interface ActionStepsProps {
  vaultOption: VaultOptions;
  show: boolean;
  onClose: () => void;
  onChangeStep: (stepData: StepData) => void;
  onSuccess: () => void;
  skipToPreview?: boolean;
  previewStepProps?: PreviewStepProps;
}

const ActionSteps: React.FC<ActionStepsProps> = ({
  vaultOption,
  show,
  onClose,
  onChangeStep,
  skipToPreview = false,
  previewStepProps,
  onSuccess,
}) => {
  const firstStep = skipToPreview ? STEPS.previewStep : STEPS.formStep;
  const [step, setStep] = useState<Steps>(firstStep);
  const [txhash, setTxhash] = useState("");
  const vault = useVault(vaultOption);
  const [pendingTransactions, setPendingTransactions] =
    usePendingTransactions();

  const [actionType, setActionType] = useState<ActionType>("deposit");
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

  const cleanupEffects = useCallback(() => {
    setTxhash("");

    if (step === STEPS.submittedStep) {
      onSuccess();
    }
  }, [step, onSuccess]);

  const handleClose = useCallback(() => {
    cleanupEffects();
    onClose();
  }, [onClose, cleanupEffects]);

  useEffect(() => {
    if (!show) {
      cleanupEffects();
    }
  }, [show, cleanupEffects]);

  // Whenever the `show` variable is toggled, we need to reset the step back to 0
  useEffect(() => {
    return () => {
      // small timeout so it doesn't flicker
      setTimeout(() => {
        setStep(firstStep);
      }, 500);
    };
  }, [show, firstStep, setStep]);

  const amountStr = amount.toString();
  const sharesStr = shares.toString();

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

  // append the txhash into the global store
  useEffect(() => {
    if (txhash !== "") {
      setPendingTransactions((pendingTransactions) => [
        ...pendingTransactions,
        {
          txhash,
          type: isDeposit ? "deposit" : "withdraw",
          amount: amountStr,
          vault: vaultOption,
        },
      ]);
    }
  }, [txhash, setPendingTransactions, isDeposit, amountStr, vaultOption]);

  useEffect(() => {
    // we check that the txhash has already been removed
    // so we can dismiss the modal
    if (step === STEPS.submittedStep && txhash !== "") {
      const pendingTx = pendingTransactions.find((tx) => tx.txhash === txhash);
      if (!pendingTx) {
        setTimeout(() => {
          handleClose();
        }, 300);
      }
    }
  }, [step, pendingTransactions, txhash, handleClose]);

  const handleClickConfirmButton = async () => {
    if (vault !== null) {
      // check illegal state transition
      if (step !== STEPS.confirmationStep - 1) return;
      setStep(STEPS.confirmationStep);
      try {
        if (isDeposit) {
          const res = await (isETHVault(vaultOption)
            ? vault.depositETH({ value: amountStr })
            : vault.deposit(amountStr));
          setTxhash(res.hash);
          setStep(STEPS.submittedStep);
        } else {
          const res = await (isETHVault(vaultOption)
            ? vault.withdrawETH(sharesStr)
            : vault.withdraw(sharesStr));
          setTxhash(res.hash);
          setStep(STEPS.submittedStep);
        }
      } catch (e) {
        console.error(e);
        handleClose();
      }
    }
  };

  useEffect(() => {
    const titles = {
      [STEPS.formStep]: "",
      [STEPS.previewStep]: `${actionWord} Preview`,
      [STEPS.confirmationStep]: `Confirm ${actionWord}`,
      [STEPS.submittedStep]: "Transaction Submitted",
    };

    onChangeStep({
      title: titles[step],
      stepNum: step,
    });
  }, [step, onChangeStep, actionWord]);

  const onSubmitForm = useCallback(
    (submittedFormProps) => {
      // check that it's a legal state transition
      // if not, just ignore
      if (step !== STEPS.previewStep - 1) return;
      setStep(STEPS.previewStep);

      setActionType(submittedFormProps.actionType);
      setAmount(submittedFormProps.amount);
      setPositionAmount(submittedFormProps.positionAmount);
      setActionParams(submittedFormProps.actionParams);
    },
    [step]
  );

  const stepComponents = {
    0: !skipToPreview && (
      <FormStep vaultOption={vaultOption} onSubmit={onSubmitForm} />
    ),
    1: (
      <PreviewStep
        {...(previewStepProps || {
          actionType,
          amount,
          positionAmount,
          actionParams,
        })}
        onClickConfirmButton={handleClickConfirmButton}
        asset={getAssets(vaultOption)}
        vaultOption={vaultOption}
      />
    ),
    2: <TransactionStep />,
    3: <TransactionStep txhash={txhash} />,
  };

  return <>{stepComponents[step]}</>;
};

export default ActionSteps;
