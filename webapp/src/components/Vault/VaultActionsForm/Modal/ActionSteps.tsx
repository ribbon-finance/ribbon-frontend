import React, { useCallback, useEffect, useState } from "react";
import { BigNumber } from "ethers";

import { ACTIONS, StepData, Steps, STEPS } from "./types";

import useVault from "shared/lib/hooks/useVault";
import PreviewStep from "./PreviewStep";
import TransactionStep from "./TransactionStep";
import FormStep from "./FormStep";
import {
  getAssets,
  VaultOptions,
  VaultVersion,
} from "shared/lib/constants/constants";
import { isETHVault } from "shared/lib/utils/vault";
import usePendingTransactions from "../../../../hooks/usePendingTransactions";
import useVaultActionForm from "../../../../hooks/useVaultActionForm";
import { parseUnits } from "@ethersproject/units";
import useVaultData from "shared/lib/hooks/useVaultData";

export interface ActionStepsProps {
  vault: {
    vaultOption: VaultOptions;
    vaultVersion: VaultVersion;
  };
  show: boolean;
  onClose: () => void;
  onChangeStep: (stepData: StepData) => void;
  skipToPreview?: boolean;
}

const ActionSteps: React.FC<ActionStepsProps> = ({
  vault: { vaultOption, vaultVersion },
  show,
  onClose,
  onChangeStep,
  skipToPreview = false,
}) => {
  const firstStep = skipToPreview ? STEPS.previewStep : STEPS.formStep;
  const [step, setStep] = useState<Steps>(firstStep);
  const [txhash, setTxhash] = useState("");
  const vault = useVault(vaultOption);
  const [pendingTransactions, setPendingTransactions] =
    usePendingTransactions();
  const { vaultBalanceInAsset, decimals } = useVaultData(vaultOption);

  // We need to pre-fetch the number of shares that the user wants to withdraw
  const [shares, setShares] = useState<BigNumber>(BigNumber.from("0"));
  const { vaultActionForm, resetActionForm } = useVaultActionForm(vaultOption);

  const isDeposit = vaultActionForm.actionType === ACTIONS.deposit;
  const actionWord = isDeposit ? "Deposit" : "Withdrawal";

  const cleanupEffects = useCallback(() => {
    setTxhash("");

    if (step === STEPS.submittedStep) {
      resetActionForm();
    }
  }, [resetActionForm, step]);

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

  const amount = parseUnits(vaultActionForm.inputAmount || "0", decimals);
  const amountStr = amount.toString();
  const sharesStr = shares.toString();

  useEffect(() => {
    if (vault) {
      (async () => {
        const shares = await vault.assetAmountToShares(amountStr);
        setShares(shares);
      })();
    }
  }, [vault, amountStr]);

  // append the txhash into the global store
  useEffect(() => {
    if (txhash !== "") {
      setPendingTransactions((pendingTransactions) => [
        ...pendingTransactions,
        {
          txhash,
          type: vaultActionForm.actionType,
          amount: amountStr,
          vault: vaultOption,
        },
      ]);
    }
  }, [txhash, setPendingTransactions, amountStr, vaultOption, vaultActionForm]);

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

  const stepComponents = {
    0: !skipToPreview && (
      <FormStep
        vaultVersion={vaultVersion}
        vaultOption={vaultOption}
        onFormSubmit={() => setStep(STEPS.previewStep)}
      />
    ),
    1: (
      <PreviewStep
        actionType={vaultActionForm.actionType}
        amount={amount}
        positionAmount={vaultBalanceInAsset}
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
