import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BigNumber } from "ethers";

import { ACTIONS, StepData, Steps, STEPS } from "./types";

import useVault from "shared/lib/hooks/useVault";
import PreviewStep from "./PreviewStep";
import TransactionStep from "./TransactionStep";
import FormStep from "./FormStep";
import {
  getAssets,
  VaultAddressMap,
  VaultOptions,
  VaultVersion,
} from "shared/lib/constants/constants";
import { isETHVault } from "shared/lib/utils/vault";
import usePendingTransactions from "../../../../hooks/usePendingTransactions";
import useVaultActionForm from "../../../../hooks/useVaultActionForm";
import { parseUnits } from "@ethersproject/units";
import useVaultData from "shared/lib/hooks/useVaultData";
import { capitalize } from "shared/lib/utils/text";
import useV2Vault from "shared/lib/hooks/useV2Vault";

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
  const v1Vault = useVault(vaultOption);
  const v2Vault = useV2Vault(vaultOption);
  const [pendingTransactions, setPendingTransactions] =
    usePendingTransactions();
  const { vaultBalanceInAsset, decimals } = useVaultData(vaultOption);

  // We need to pre-fetch the number of shares that the user wants to withdraw
  const { vaultActionForm, resetActionForm } = useVaultActionForm(vaultOption);

  const actionWord = capitalize(vaultActionForm.actionType);

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

  const [amount, amountStr] = useMemo(() => {
    try {
      const amount = parseUnits(vaultActionForm.inputAmount || "0", decimals);
      return [amount, amount.toString()];
    } catch (err) {
      return [BigNumber.from(0), "0"];
    }
  }, [decimals, vaultActionForm.inputAmount]);

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
    const vault = vaultActionForm.vaultVersion === "v1" ? v1Vault : v2Vault;
    
    if (vault !== null) {
      // check illegal state transition
      if (step !== STEPS.confirmationStep - 1) return;
      setStep(STEPS.confirmationStep);
      try {
        let res: any;
        let shares: BigNumber;
        switch (vaultActionForm.actionType) {
          case ACTIONS.deposit:
            res = await (isETHVault(vaultOption)
              ? vault.depositETH({ value: amountStr })
              : vault.deposit(amountStr));
            break;
          case ACTIONS.withdraw:
            /** Handle different version of withdraw separately */
            switch (vaultActionForm.vaultVersion) {
              /**
               * V1 withdraw
               */
              case "v1":
                shares = await vault.assetAmountToShares(amountStr);
                res = await (isETHVault(vaultOption)
                  ? vault.withdrawETH(shares)
                  : vault.withdraw(shares));
                break;

              /**
               * V2 withdraw
               */
              case "v2":
                switch (vaultActionForm.withdrawOption) {
                  /** Instant withdraw for V2 */
                  case "instant":
                    res = await vault.withdrawInstantly(amountStr);
                    break;

                  /** Initiate withdrawal for v2 */
                  case "standard":
                    res = await vault.initiateWithdraw(amountStr);
                    break;
                }
                break;
            }
            break;
          case ACTIONS.transfer:
            shares = await vault.assetAmountToShares(amountStr);
            res = await vault.withdrawToV1Vault(
              shares,
              VaultAddressMap[vaultActionForm.receiveVault!].v1
            );
            break;
          case ACTIONS.migrate:
            res = await vault.migrate();
            break;
        }

        /**
         * Append transaction into pending transaction list
         */
        switch (vaultActionForm.actionType) {
          case ACTIONS.deposit:
          case ACTIONS.withdraw:
          case ACTIONS.migrate:
            setPendingTransactions((pendingTransactions) => [
              ...pendingTransactions,
              {
                txhash: res.hash,
                type: vaultActionForm.actionType as
                  | "deposit"
                  | "withdraw"
                  | "migrate",
                amount: amountStr,
                vault: vaultOption,
              },
            ]);
            break;
          case ACTIONS.transfer:
            setPendingTransactions((pendingTransactions) => [
              ...pendingTransactions,
              {
                txhash: res.hash,
                type: ACTIONS.transfer as "transfer",
                amount: amountStr,
                transferVault: vaultOption,
                receiveVault: vaultActionForm.receiveVault!,
              },
            ]);
            break;
        }

        setTxhash(res.hash);
        setStep(STEPS.submittedStep);
      } catch (e) {
        console.error(e);
        handleClose();
      }
    }
  };

  useEffect(() => {
    const titles = {
      [STEPS.formStep]: "",
      [STEPS.previewStep]:
        vaultActionForm.actionType === "migrate" ? "" : `${actionWord} Preview`,
      [STEPS.confirmationStep]: `Confirm ${actionWord}`,
      [STEPS.submittedStep]: "Transaction Submitted",
    };

    onChangeStep({
      title: titles[step],
      stepNum: step,
    });
  }, [actionWord, onChangeStep, step, vaultActionForm.actionType]);

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
        receiveVaultOption={vaultActionForm.receiveVault}
      />
    ),
    2: <TransactionStep />,
    3: <TransactionStep txhash={txhash} />,
  };

  return <>{stepComponents[step]}</>;
};

export default ActionSteps;
