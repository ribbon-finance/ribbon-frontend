import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BigNumber } from "ethers";
import { useWeb3React } from "@web3-react/core";

import { ACTIONS, Steps, STEPS } from "./types";
import useVault from "shared/lib/hooks/useVault";
import PreviewStep from "./PreviewStep";
import TransactionStep from "./TransactionStep";
import FormStep from "./FormStep";
import {
  getAssets,
  VaultAddressMap,
  VaultOptions,
  VaultVersion,
  LidoCurvePoolAddress,
  VaultAllowedDepositAssets,
  CurveSwapSlippage,
} from "shared/lib/constants/constants";
import { isETHVault } from "shared/lib/utils/vault";
import { amountAfterSlippage } from "shared/lib/utils/math";
import { usePendingTransactions } from "shared/lib/hooks/pendingTransactionsContext";
import useVaultActionForm from "../../../../hooks/useVaultActionForm";
import { parseUnits } from "@ethersproject/units";
import { useVaultData, useV2VaultData } from "shared/lib/hooks/web3DataContext";
import useV2Vault from "shared/lib/hooks/useV2Vault";
import WarningStep from "./WarningStep";
import { getCurvePool } from "shared/lib/hooks/useCurvePool";

export interface ActionStepsProps {
  vault: {
    vaultOption: VaultOptions;
    vaultVersion: VaultVersion;
  };
  show: boolean;
  onClose: () => void;
  step: Steps;
  onChangeStep: (stepData: Steps) => void;
  skipToPreview?: boolean;
}

const ActionSteps: React.FC<ActionStepsProps> = ({
  vault: { vaultOption, vaultVersion },
  show,
  onClose,
  step,
  onChangeStep,
  skipToPreview = false,
}) => {
  const { library } = useWeb3React();
  const { vaultActionForm, resetActionForm, withdrawMetadata } =
    useVaultActionForm(vaultOption);

  const firstStep = useMemo(() => {
    if (
      vaultActionForm.actionType === ACTIONS.withdraw &&
      vaultActionForm.vaultVersion === "v2" &&
      vaultActionForm.withdrawOption === "standard" &&
      !withdrawMetadata.instantWithdrawBalance?.isZero()
    ) {
      return STEPS.warningStep;
    }

    return skipToPreview ? STEPS.previewStep : STEPS.formStep;
  }, [
    skipToPreview,
    vaultActionForm.actionType,
    vaultActionForm.vaultVersion,
    vaultActionForm.withdrawOption,
    withdrawMetadata.instantWithdrawBalance,
  ]);
  const [txhash, setTxhash] = useState("");
  const v1Vault = useVault(vaultOption);
  const v2Vault = useV2Vault(vaultOption);
  const { pendingTransactions, addPendingTransaction } =
    usePendingTransactions();
  const { vaultBalanceInAsset: v1VaultBalanceInAsset } =
    useVaultData(vaultOption);
  const {
    data: {
      pricePerShare,
      decimals,
      lockedBalanceInAsset,
      depositBalanceInAsset,
      withdrawals,
    },
  } = useV2VaultData(vaultOption);

  const asset = useMemo(() => {
    switch (vaultActionForm.actionType) {
      case ACTIONS.deposit:
        return (
          vaultActionForm.depositAsset ||
          VaultAllowedDepositAssets[vaultOption][0]
        );
      default:
        return getAssets(vaultOption);
    }
  }, [vaultActionForm.actionType, vaultActionForm.depositAsset, vaultOption]);

  const vaultBalanceInAsset = useMemo(() => {
    if (vaultActionForm.actionType === "migrate") {
      return v1VaultBalanceInAsset;
    }
    switch (vaultVersion) {
      case "v1":
        return v1VaultBalanceInAsset;
      case "v2":
        return lockedBalanceInAsset
          .add(depositBalanceInAsset)
          .add(withdrawals.amount);
    }
  }, [
    depositBalanceInAsset,
    lockedBalanceInAsset,
    v1VaultBalanceInAsset,
    vaultVersion,
    withdrawals,
    vaultActionForm.actionType,
  ]);

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
    if (!skipToPreview && step === STEPS.formStep) {
      return;
    }

    return () => {
      onChangeStep(firstStep);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, firstStep, skipToPreview]);

  const [amount, amountStr] = useMemo(() => {
    try {
      const amount = parseUnits(vaultActionForm.inputAmount || "0", decimals);
      return [amount, amount.toString()];
    } catch (err) {
      return [BigNumber.from(0), "0"];
    }
  }, [decimals, vaultActionForm.inputAmount]);

  useEffect(() => {
    // we check that the txhash and check if it had succeed
    // so we can dismiss the modal
    if (step === STEPS.submittedStep && txhash !== "") {
      const pendingTx = pendingTransactions.find((tx) => tx.txhash === txhash);
      if (pendingTx && pendingTx.status) {
        setTimeout(() => {
          handleClose();
        }, 300);
      }
    }
  }, [pendingTransactions, txhash, handleClose, step]);

  const handleClickConfirmButton = async () => {
    const vault = vaultActionForm.vaultVersion === "v1" ? v1Vault : v2Vault;

    if (vault !== null) {
      // check illegal state transition
      if (step !== STEPS.confirmationStep - 1) return;
      onChangeStep(STEPS.confirmationStep);
      try {
        let res: any;
        let shares: BigNumber;
        switch (vaultActionForm.actionType) {
          case ACTIONS.deposit:
            switch (vaultOption) {
              case "rstETH-THETA":
                res = await (asset === "WETH"
                  ? vault.depositETH({ value: amountStr })
                  : vault.depositYieldToken(amountStr));
                break;
              default:
                res = await (asset === "WETH"
                  ? vault.depositETH({ value: amountStr })
                  : vault.deposit(amountStr));
            }
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
                    switch (vaultActionForm.vaultOption) {
                      case "rstETH-THETA":
                        /**
                         * Default slippage of 0.3%
                         */
                        const curvePool = getCurvePool(
                          library,
                          LidoCurvePoolAddress
                        );

                        const minOut = await curvePool.get_dy(
                          1,
                          0,
                          amountAfterSlippage(amount, CurveSwapSlippage),
                          {
                            gasLimit: 400000,
                          }
                        );
                        res = await vault.withdrawInstantly(amountStr, minOut, {
                          gasLimit: 220000,
                        });
                        break;
                      default:
                        res = await vault.withdrawInstantly(amountStr);
                    }
                    break;

                  /** Initiate withdrawal for v2 */
                  case "standard":
                    shares = amount
                      .mul(BigNumber.from(10).pow(decimals))
                      .div(pricePerShare);
                    res = await vault.initiateWithdraw(shares);
                    break;
                  case "complete":
                    switch (vaultActionForm.vaultOption) {
                      case "rstETH-THETA":
                        /**
                         * Default slippage of 0.3%
                         */
                        const curvePool = getCurvePool(
                          library,
                          LidoCurvePoolAddress
                        );
                        const minOut = await curvePool.get_dy(
                          1,
                          0,
                          amountAfterSlippage(amount, CurveSwapSlippage),
                          {
                            gasLimit: 400000,
                          }
                        );
                        res = await vault.completeWithdraw(minOut, {
                          gasLimit: 400000,
                        });
                        break;
                      default:
                        res = await vault.completeWithdraw();
                    }
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
            addPendingTransaction({
              txhash: res.hash,
              type: "deposit",
              amount: amountStr,
              vault: vaultOption,
              asset: asset,
            });
            break;
          case ACTIONS.withdraw:
            /**
             * Standard withdrawal
             */
            if (vaultActionForm.withdrawOption === "standard") {
              addPendingTransaction({
                txhash: res.hash,
                type: "withdrawInitiation",
                amount: amountStr,
                vault: vaultOption,
              });
              break;
            }
            /**
             * Other type of withdrawals
             */
            addPendingTransaction({
              txhash: res.hash,
              type: "withdraw",
              amount: amountStr,
              vault: vaultOption,
            });
            break;
          case ACTIONS.migrate:
            addPendingTransaction({
              txhash: res.hash,
              type: "migrate",
              amount: amountStr,
              vault: vaultOption,
            });
            break;
          case ACTIONS.transfer:
            addPendingTransaction({
              txhash: res.hash,
              type: ACTIONS.transfer as "transfer",
              amount: amountStr,
              transferVault: vaultOption,
              receiveVault: vaultActionForm.receiveVault!,
            });
            break;
        }

        setTxhash(res.hash);
        onChangeStep(STEPS.submittedStep);
      } catch (e) {
        console.error(e);
        handleClose();
      }
    }
  };

  const stepComponents = {
    [-1]: (
      <WarningStep
        actionType={vaultActionForm.actionType}
        withdrawOption={vaultActionForm.withdrawOption}
        vaultOption={vaultOption}
        vaultVersion={vaultActionForm.vaultVersion}
        withdrawMetadata={withdrawMetadata}
        onFormSubmit={() => onChangeStep(STEPS.previewStep)}
      />
    ),
    0: !skipToPreview && (
      <FormStep
        vaultVersion={vaultVersion}
        vaultOption={vaultOption}
        onFormSubmit={() => onChangeStep(STEPS.previewStep)}
      />
    ),
    1: (
      <PreviewStep
        actionType={vaultActionForm.actionType}
        amount={amount}
        positionAmount={vaultBalanceInAsset}
        onClickConfirmButton={handleClickConfirmButton}
        asset={asset}
        vaultOption={vaultOption}
        vaultVersion={vaultVersion}
        receiveVaultOption={vaultActionForm.receiveVault}
        withdrawOption={vaultActionForm.withdrawOption}
      />
    ),
    2: <TransactionStep />,
    3: <TransactionStep txhash={txhash} />,
  };

  return <>{stepComponents[step]}</>;
};

export default ActionSteps;
