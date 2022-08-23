import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BigNumber } from "ethers";
import { ActionType, Steps, STEPS } from "./types";
import PreviewStep from "./PreviewStep";
import TransactionStep from "./TransactionStep";
import {
  getAssets,
  VaultOptions,
  VaultVersion,
} from "shared/lib/constants/constants";
import { usePendingTransactions } from "shared/lib/hooks/pendingTransactionsContext";
import useVaultActionForm from "../../../../hooks/useVaultActionForm";
import { parseUnits } from "@ethersproject/units";
import { useV2VaultData } from "shared/lib/hooks/web3DataContext";
import { useVaultsPriceHistory } from "shared/lib/hooks/useVaultPerformanceUpdate";
import { getAssetColor, getAssetDecimals } from "shared/lib/utils/asset";
import { RibbonEarnVault } from "shared/lib/codegen";
import DepositFormStep from "./DepositFormStep";
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
  skipToPreview?: boolean;
  actionType: ActionType;
}

const ActionSteps: React.FC<ActionStepsProps> = ({
  vault: { vaultOption, vaultVersion },
  show,
  onClose,
  step,
  onChangeStep,
  skipToPreview = false,
  actionType,
}) => {
  const { resetActionForm } = useVaultActionForm(vaultOption);
  const { data: priceHistories } = useVaultsPriceHistory();

  const firstStep = useMemo(() => {
    return STEPS.formStep;
  }, []);

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
    },
  } = useV2VaultData(vaultOption);

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
  const [signature, setSignature] = useState<DepositSignature | undefined>();

  const amountStr = useMemo(() => {
    try {
      const amount = parseUnits(inputAmount, decimals);
      return amount.toString();
    } catch (err) {
      return "0";
    }
  }, [decimals, inputAmount]);

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
        onClickUpdateInput={setInputAmount}
        onClickConfirmButton={handleClickNextButton}
        asset={asset}
        vaultOption={vaultOption}
        vaultVersion={vaultVersion}
      />
    ),
    1: (
      <PreviewStep
        actionType={actionType}
        amount={BigNumber.from(amountStr)}
        positionAmount={vaultBalanceInAsset}
        onClickConfirmButton={handleClickConfirmButton}
        asset={asset}
        vaultOption={vaultOption}
        vaultVersion={vaultVersion}
        onSignatureMade={setSignature}
      />
    ),
    2: <TransactionStep color={getAssetColor(asset)} />,
    3: <TransactionStep txhash={txhash} color={getAssetColor(asset)} />,
  };

  return <>{stepComponents[step]}</>;
};

export default ActionSteps;
