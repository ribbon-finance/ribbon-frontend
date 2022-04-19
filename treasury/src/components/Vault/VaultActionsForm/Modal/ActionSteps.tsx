import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BigNumber } from "ethers";
import { useWeb3Wallet } from "shared/lib/hooks/useWeb3Wallet";

import {
  ACTIONS,
  Steps,
  STEPS,
} from "webapp/lib/components/Vault/VaultActionsForm/Modal/types";
import useVault from "shared/lib/hooks/useVault";
import PreviewStep from "./PreviewStep";
import TransactionStep from "webapp/lib/components/Vault/VaultActionsForm/Modal/TransactionStep";
import FormStep from "webapp/lib/components/Vault/VaultActionsForm/Modal/FormStep";
import {
  getAssets,
  isNativeToken,
  VaultOptions,
  VaultVersion,
  LidoCurvePoolAddress,
  VaultAllowedDepositAssets,
  CurveSwapSlippage,
} from "shared/lib/constants/constants";
import { isETHVault } from "shared/lib/utils/vault";
import { amountAfterSlippage } from "shared/lib/utils/math";
import { usePendingTransactions } from "shared/lib/hooks/pendingTransactionsContext";
import useVaultActionForm from "webapp/lib/hooks/useVaultActionForm";
import { parseUnits } from "@ethersproject/units";
import { useVaultData, useV2VaultData } from "shared/lib/hooks/web3DataContext";
import useV2VaultContract from "shared/lib/hooks/useV2VaultContract";
import WarningStep from "webapp/lib/components/Vault/VaultActionsForm/Modal/WarningStep";
import { getCurvePool } from "shared/lib/hooks/useCurvePool";
import useVaultAccounts from "shared/lib/hooks/useVaultAccounts";
import { useVaultsPriceHistory } from "shared/lib/hooks/useVaultPerformanceUpdate";
import { getAssetColor, getAssetDecimals } from "shared/lib/utils/asset";
import {
  RibbonCoveredCall,
  RibbonV2stETHThetaVault,
  RibbonV2ThetaVault,
} from "shared/lib/codegen";

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
  const { ethereumProvider } = useWeb3Wallet();
  const { vaultActionForm, resetActionForm, withdrawMetadata } =
    useVaultActionForm(vaultOption);
  const { data: priceHistories } = useVaultsPriceHistory();

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
  const v1Vault = useVault(
    vaultActionForm.actionType === ACTIONS.migrate
      ? vaultActionForm.migrateSourceVault || vaultOption
      : vaultOption
  );
  const v2Vault = useV2VaultContract(vaultOption);
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
  const { vaultAccounts: v1VaultAccounts } = useVaultAccounts("v1");

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
      return (
        v1VaultAccounts[vaultActionForm.migrateSourceVault || vaultOption]
          ?.totalBalance || BigNumber.from(0)
      );
    }
    switch (vaultVersion) {
      case "v1":
        return v1VaultBalanceInAsset;
      case "v2":
        const priceHistory = priceHistories.v2[
          vaultOption as VaultOptions
        ].find((history) => history.round === withdrawals.round);
        return lockedBalanceInAsset
          .add(depositBalanceInAsset)
          .add(
            withdrawals.shares
              .mul(
                priceHistory ? priceHistory.pricePerShare : BigNumber.from(0)
              )
              .div(parseUnits("1", getAssetDecimals(getAssets(vaultOption))))
          );
    }
  }, [
    depositBalanceInAsset,
    lockedBalanceInAsset,
    priceHistories.v2,
    v1VaultAccounts,
    v1VaultBalanceInAsset,
    vaultOption,
    vaultVersion,
    withdrawals,
    vaultActionForm.actionType,
    vaultActionForm.migrateSourceVault,
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
                res = await (isNativeToken(asset)
                  ? (vault as RibbonV2ThetaVault).depositETH({
                      value: amountStr,
                    })
                  : (vault as RibbonV2stETHThetaVault).depositYieldToken(
                      amountStr
                    ));
                break;
              default:
                res = await (isNativeToken(asset)
                  ? (vault as RibbonV2ThetaVault).depositETH({
                      value: amountStr,
                    })
                  : (vault as RibbonV2ThetaVault).deposit(amountStr));
            }
            break;
          case ACTIONS.withdraw:
            /** Handle different version of withdraw separately */
            switch (vaultActionForm.vaultVersion) {
              /**
               * V1 withdraw
               */
              case "v1":
                const v1Vault = vault as RibbonCoveredCall;
                shares = await v1Vault.assetAmountToShares(amountStr);
                res = await (isETHVault(vaultOption)
                  ? v1Vault.withdrawETH(shares)
                  : v1Vault.withdraw(shares));
                break;

              /**
               * V2 withdraw
               */
              case "v2":
                const v2Vault = vault as RibbonV2ThetaVault;
                switch (vaultActionForm.withdrawOption) {
                  /** Instant withdraw for V2 */
                  case "instant":
                    switch (vaultActionForm.vaultOption) {
                      case "rstETH-THETA":
                        /**
                         * Default slippage of 0.3%
                         */
                        const curvePool = getCurvePool(
                          ethereumProvider,
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
                        // Special for RibbonV2stETH vault
                        res = await (
                          vault as RibbonV2stETHThetaVault
                        ).withdrawInstantly(amountStr, minOut, {
                          gasLimit: 220000,
                        });
                        break;
                      default:
                        res = await v2Vault.withdrawInstantly(amountStr);
                        break;
                    }
                    break;

                  /** Initiate withdrawal for v2 */
                  case "standard":
                    shares = amount
                      .mul(BigNumber.from(10).pow(decimals))
                      .div(pricePerShare);
                    res = await v2Vault.initiateWithdraw(shares);
                    break;
                  case "complete":
                    switch (vaultActionForm.vaultOption) {
                      case "rstETH-THETA":
                        /**
                         * Default slippage of 0.3%
                         */
                        const curvePool = getCurvePool(
                          ethereumProvider,
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
                        // Special for RibbonV2stETH vault
                        res = await (
                          vault as RibbonV2stETHThetaVault
                        ).completeWithdraw(minOut, {
                          gasLimit: 400000,
                        });
                        break;
                      default:
                        res = await v2Vault.completeWithdraw();
                        break;
                    }
                    break;
                }
                break;
            }
            break;
          case ACTIONS.transfer:
            // Transfer action is not currently used at all
            break;
          case ACTIONS.migrate:
            res = await (vault as RibbonCoveredCall).migrate();
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
    2: <TransactionStep color={getAssetColor(asset)} />,
    3: <TransactionStep txhash={txhash} color={getAssetColor(asset)} />,
  };

  return <>{stepComponents[step]}</>;
};

export default ActionSteps;
