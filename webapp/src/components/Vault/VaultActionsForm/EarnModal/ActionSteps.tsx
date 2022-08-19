import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BigNumber } from "ethers";
import { useWeb3Wallet } from "shared/lib/hooks/useWeb3Wallet";
import { formatUnits } from "ethers/lib/utils";
import { ACTIONS, Steps, STEPS } from "./types";
import useVault from "shared/lib/hooks/useVault";
import PreviewStep from "./PreviewStep";
import TransactionStep from "./TransactionStep";
import FormStep from "./FormStep";
import {
  getAssets,
  isNativeToken,
  VaultOptions,
  VaultVersion,
  VaultAllowedDepositAssets,
  getSolanaVaultInstance,
  isSolanaVault,
} from "shared/lib/constants/constants";
import { isETHVault } from "shared/lib/utils/vault";
import { usePendingTransactions } from "shared/lib/hooks/pendingTransactionsContext";
import useVaultActionForm from "../../../../hooks/useVaultActionForm";
import { parseUnits } from "@ethersproject/units";
import { useVaultData, useV2VaultData } from "shared/lib/hooks/web3DataContext";
import useV2VaultContract from "shared/lib/hooks/useV2VaultContract";
import WarningStep from "./WarningStep";
import { depositSAVAX } from "shared/lib/hooks/useSAVAXDeposit";
import useVaultAccounts from "shared/lib/hooks/useVaultAccounts";
import { useFlexVault } from "shared/lib/hooks/useFlexVault";
import useLidoCurvePool from "shared/lib/hooks/useLidoCurvePool";
import useSTETHDepositHelper from "shared/lib/hooks/useSTETHDepositHelper";
import { useVaultsPriceHistory } from "shared/lib/hooks/useVaultPerformanceUpdate";
import { getAssetColor, getAssetDecimals } from "shared/lib/utils/asset";
import * as anchor from "@project-serum/anchor";
import {
  RibbonCoveredCall,
  RibbonEarnVault,
  RibbonV2stETHThetaVault,
  RibbonV2ThetaVault,
} from "shared/lib/codegen";
import useLoadingText from "shared/lib/hooks/useLoadingText";
import DepositFormStep from "./DepositFormStep";
import useEarnVaultContract from "shared/lib/hooks/useEarnVaultContract";
import VaultSignatureForm from "../common/VaultSignatureForm";
import { ISignature } from "../common/signing";
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
  const { client } = useFlexVault();
  const { vaultActionForm, resetActionForm, withdrawMetadata } =
    useVaultActionForm(vaultOption);
  const { data: priceHistories } = useVaultsPriceHistory();

  const firstStep = useMemo(() => {
    return STEPS.warningStep;
  }, [
    skipToPreview,
    vaultActionForm.actionType,
    vaultActionForm.vaultVersion,
    vaultActionForm.withdrawOption,
    withdrawMetadata.instantWithdrawBalance,
  ]);

  const [txhash, setTxhash] = useState("");

  // Keep track of the min stETH exchanged
  const loadingText = useLoadingText();
  const [minSTETHAmount, setMinSTETHAmount] = useState<BigNumber | undefined>();

  const earnVault = useEarnVaultContract(vaultOption);
  const { contract, getMinSTETHAmount } = useLidoCurvePool();
  const stETHDepositHelper = useSTETHDepositHelper();

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
      case "earn":
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

  const [inputAmount, setInputAmount] = useState<number>(0);
  const [signature, setSignature] = useState<ISignature | undefined>();
  const [deadline, setDeadline] = useState<number>();
  console.log(signature);
  const [amount, amountStr] = useMemo(() => {
    try {
      const amount = parseUnits(inputAmount.toString(), decimals);
      return [amount, amount.toString()];
    } catch (err) {
      return [BigNumber.from(0), "0"];
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

  // Whenever the `show` variable is toggled, we need to reset the step back to 0
  useEffect(() => {
    // if (!skipToPreview && step === STEPS.formStep) {
    //   return;
    // }

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

  const handleSignatureFound = async () => {
    onChangeStep(STEPS.formStep);
  };

  const handleClickConfirmButton = async () => {
    const vault = earnVault as RibbonEarnVault;

    if (vault !== null) {
      // check illegal state transition
      if (step !== STEPS.confirmationStep - 1) return;
      onChangeStep(STEPS.confirmationStep);
      try {
        let res: any;
        console.log("reached2");
        if (!signature || !deadline) {
          return;
        }
        console.log("reached");
        console.log({ amountStr });
        console.log({ deadline });
        console.log(signature.v);
        console.log(signature.r);
        console.log(signature.s);
        res = await vault.depositWithPermit(
          amountStr,
          deadline.toString(),
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
    [-1]: (
      <VaultSignatureForm
        onSignatureMade={setSignature}
        onSignComplete={handleSignatureFound}
        onSetDeadline={setDeadline}
        vaultOption={vaultOption}
        version="earn"
      />
    ),
    0: (
      <DepositFormStep
        actionType={vaultActionForm.actionType}
        onClickUpdateInput={setInputAmount}
        onClickConfirmButton={handleClickNextButton}
        asset={asset}
        vaultOption={vaultOption}
        vaultVersion={vaultVersion}
      />
      // <FormStep
      //   vaultVersion={vaultVersion}
      //   vaultOption={vaultOption}
      //   onFormSubmit={() => onChangeStep(STEPS.previewStep)}
      // />
    ),
    1: (
      <PreviewStep
        actionType={vaultActionForm.actionType}
        amount={BigNumber.from(inputAmount * 10 ** 6)}
        positionAmount={vaultBalanceInAsset}
        onClickConfirmButton={handleClickConfirmButton}
        asset={asset}
        vaultOption={vaultOption}
        vaultVersion={vaultVersion}
        receiveVaultOption={vaultActionForm.receiveVault}
        withdrawOption={vaultActionForm.withdrawOption}
        estimatedSTETHDepositAmount={
          minSTETHAmount
            ? `~${parseFloat(formatUnits(minSTETHAmount, 18)).toFixed(4)} stETH`
            : loadingText
        }
      />
    ),
    2: <TransactionStep color={getAssetColor(asset)} />,
    3: <TransactionStep txhash={txhash} color={getAssetColor(asset)} />,
  };

  return <>{stepComponents[step]}</>;
};

export default ActionSteps;
