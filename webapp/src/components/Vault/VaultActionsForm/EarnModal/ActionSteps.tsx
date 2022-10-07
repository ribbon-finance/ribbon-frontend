import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BigNumber } from "ethers";
import { ActionType, Steps, STEPS, V2WithdrawOption } from "./types";
import PreviewStep from "./PreviewStep";
import TransactionStep from "./TransactionStep";
import {
  getAssets,
  VaultOptions,
  VaultVersion,
} from "shared/lib/constants/constants";
import { usePendingTransactions } from "shared/lib/hooks/pendingTransactionsContext";
import { parseUnits } from "@ethersproject/units";
import { useV2VaultData } from "shared/lib/hooks/web3DataContext";
import useVaultPriceHistory, {
  useVaultsPriceHistory,
} from "shared/lib/hooks/useVaultPerformanceUpdate";
import { getAssetColor, getAssetDecimals } from "shared/lib/utils/asset";
import { RibbonEarnVault } from "shared/lib/codegen";
import DepositFormStep from "./FormStep";
import useEarnVaultContract from "shared/lib/hooks/useEarnVaultContract";
import { DepositSignature } from "../../../../hooks/useUSDC";
export interface ActionStepsProps {
  vault: {
    vaultOption: VaultOptions;
    vaultVersion: VaultVersion;
  };
  show: boolean;
  onClose: () => void;
  step: Steps;
  onChangeStep: (stepData: Steps) => void;
  v2WithdrawOption: V2WithdrawOption;
  skipToPreview?: boolean;
  actionType: ActionType;
}

const ActionSteps: React.FC<ActionStepsProps> = ({
  vault: { vaultOption, vaultVersion },
  show,
  onClose,
  step,
  onChangeStep,
  v2WithdrawOption,
  skipToPreview = false,
  actionType,
}) => {
  const { data: priceHistories } = useVaultsPriceHistory();

  const firstStep = useMemo(() => {
    return v2WithdrawOption === "complete" ? STEPS.previewStep : STEPS.formStep;
  }, [v2WithdrawOption]);

  const [txhash, setTxhash] = useState("");

  const earnVault = useEarnVaultContract(vaultOption);

  const { pendingTransactions, addPendingTransaction } =
    usePendingTransactions();
  const {
    data: {
      asset,
      decimals,
      lockedBalanceInAsset,
      depositBalanceInAsset,
      withdrawals,
      pricePerShare,
    },
  } = useV2VaultData(vaultOption);
  const { priceHistory } = useVaultPriceHistory(vaultOption, "earn");

  const vaultBalanceInAsset = useMemo(() => {
    const priceHistory = priceHistories.v2[vaultOption as VaultOptions].find(
      (history) => history.round === withdrawals.round
    );
    return lockedBalanceInAsset
      .add(depositBalanceInAsset)
      .add(
        withdrawals.shares
          .mul(priceHistory ? priceHistory.pricePerShare : BigNumber.from(0))
          .div(parseUnits("1", getAssetDecimals(getAssets(vaultOption))))
      );
  }, [
    depositBalanceInAsset,
    lockedBalanceInAsset,
    priceHistories.v2,
    vaultOption,
    withdrawals,
  ]);

  const [inputAmount, setInputAmount] = useState<string>("");
  const [withdrawOption, setWithdrawOption] =
    useState<V2WithdrawOption>(v2WithdrawOption);
  const [signature, setSignature] = useState<DepositSignature | undefined>();
  const amountStr = useMemo(() => {
    try {
      const amount = parseUnits(inputAmount, decimals);
      return amount.toString();
    } catch (err) {
      return "0";
    }
  }, [decimals, inputAmount]);

  const withdrawalAmount = useMemo(
    () =>
      withdrawals.shares
        .mul(
          priceHistory.find((history) => history.round === withdrawals.round)
            ?.pricePerShare || BigNumber.from(0)
        )
        .div(parseUnits("1", decimals)),
    [decimals, priceHistory, withdrawals.round, withdrawals.shares]
  );

  const cleanupEffects = useCallback(() => {
    setTxhash("");
    setInputAmount("");
  }, []);

  const handleClose = useCallback(() => {
    cleanupEffects();
    onClose();
  }, [onClose, cleanupEffects]);

  useEffect(() => {
    if (!show) {
      cleanupEffects();
    }
  }, [show, cleanupEffects]);

  useEffect(() => {
    return () => {
      onChangeStep(firstStep);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, firstStep, skipToPreview]);

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

  const handleClickNextButton = async () => {
    onChangeStep(STEPS.previewStep);
  };

  const handleClickConfirmButton = async () => {
    const vault = earnVault as RibbonEarnVault;

    if (vault !== null) {
      // check illegal state transition
      if (step !== STEPS.confirmationStep - 1) return;
      onChangeStep(STEPS.confirmationStep);
      try {
        let res: any;
        switch (actionType) {
          case "deposit":
            if (!signature) {
              return;
            }

            res = await vault.depositWithPermit(
              amountStr,
              signature.deadline,
              signature.v,
              signature.r,
              signature.s
            );

            addPendingTransaction({
              txhash: res.hash,
              type: "deposit",
              amount: amountStr,
              vault: vaultOption,
              asset: asset,
            });

            setTxhash(res.hash);
            onChangeStep(STEPS.submittedStep);
            break;
          case "withdraw":
            switch (withdrawOption) {
              case "standard":
                const shares = BigNumber.from(amountStr)
                  .mul(BigNumber.from(10).pow(decimals))
                  .div(pricePerShare);
                res = await vault.initiateWithdraw(shares);
                addPendingTransaction({
                  txhash: res.hash,
                  type: "withdrawInitiation",
                  amount: amountStr,
                  vault: vaultOption,
                });

                setTxhash(res.hash);
                onChangeStep(STEPS.submittedStep);
                break;
              case "instant":
                res = await vault.withdrawInstantly(amountStr);
                addPendingTransaction({
                  txhash: res.hash,
                  type: "withdraw",
                  amount: amountStr,
                  vault: vaultOption,
                });

                setTxhash(res.hash);
                onChangeStep(STEPS.submittedStep);
                break;
              case "complete":
                const amountToStr = withdrawalAmount.toString();
                res = await vault.completeWithdraw();
                addPendingTransaction({
                  txhash: res.hash,
                  type: "withdraw",
                  amount: amountToStr,
                  vault: vaultOption,
                });

                setTxhash(res.hash);
                onChangeStep(STEPS.submittedStep);
                break;
            }
            break;
        }
      } catch (e) {
        console.error(e);
        handleClose();
      }
    }
  };

  const stepComponents = {
    0: (
      <DepositFormStep
        actionType={actionType}
        inputAmount={inputAmount}
        onClickUpdateInput={setInputAmount}
        onClickUpdateWithdrawOption={setWithdrawOption}
        onClickConfirmButton={handleClickNextButton}
        asset={asset}
        vaultOption={vaultOption}
        vaultVersion={vaultVersion}
        show={show}
      />
    ),
    1: (
      <PreviewStep
        actionType={actionType}
        amount={BigNumber.from(amountStr)}
        positionAmount={vaultBalanceInAsset}
        onClickConfirmButton={handleClickConfirmButton}
        asset={asset}
        withdrawOption={withdrawOption}
        vaultOption={vaultOption}
        vaultVersion={vaultVersion}
        onSignatureMade={setSignature}
        show={show}
      />
    ),
    2: <TransactionStep color={getAssetColor(asset)} />,
    3: <TransactionStep txhash={txhash} color={getAssetColor(asset)} />,
  };

  return <>{stepComponents[step]}</>;
};

export default ActionSteps;
