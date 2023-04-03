import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BigNumber } from "ethers";
import { ActionType, Steps, STEPS, V2WithdrawOption } from "./types";
import PreviewStep from "./PreviewStep";
import TransactionStep from "./TransactionStep";
import {
  getAssets,
  isNoApproveToken,
  VaultAllowedDepositAssets,
  VaultOptions,
  VaultVersion,
} from "shared/lib/constants/constants";
import { usePendingTransactions } from "shared/lib/hooks/pendingTransactionsContext";
import { parseUnits } from "@ethersproject/units";
import { useV2VaultData } from "shared/lib/hooks/web3DataContext";
import useVaultPriceHistory, {
  useVaultsPriceHistory,
} from "shared/lib/hooks/useVaultPerformanceUpdate";
import { getAssetDecimals } from "shared/lib/utils/asset";
import { RibbonEarnVault } from "shared/lib/codegen";
import FormStep from "./FormStep";
import useVaultContract from "shared/lib/hooks/useVaultContract";
import { DepositSignature } from "../../../../hooks/useUSDC";
import { Assets } from "shared/lib/store/types";
import useLidoCurvePool from "shared/lib/hooks/useLidoCurvePool";
import useSTETHDepositHelper from "shared/lib/hooks/useSTETHDepositHelper";
import { formatUnits } from "ethers/lib/utils";
import useLoadingText from "shared/lib/hooks/useLoadingText";
import { getVaultColor } from "shared/lib/utils/vault";

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
  const [depositAsset, earnHandleDepositAssetChange] = useState<Assets>(
    VaultAllowedDepositAssets[vaultOption][0]
  );

  const { pendingTransactions, addPendingTransaction } =
    usePendingTransactions();
  const {
    data: {
      decimals,
      lockedBalanceInAsset,
      depositBalanceInAsset,
      withdrawals,
      pricePerShare,
    },
  } = useV2VaultData(vaultOption);
  const { priceHistory } = useVaultPriceHistory(vaultOption, "earn");

  const asset = useMemo(() => {
    return vaultOption === "rEARN-stETH" && actionType === "withdraw"
      ? "stETH"
      : depositAsset;
  }, [actionType, depositAsset, vaultOption]);

  const color = getVaultColor(vaultOption);
  const firstStep = useMemo(() => {
    if (v2WithdrawOption === "complete") {
      return STEPS.previewStep;
    }
    return STEPS.formStep;
  }, [v2WithdrawOption]);

  const [minSTETHAmount, setMinSTETHAmount] = useState<BigNumber | undefined>();
  const [txhash, setTxhash] = useState<string | undefined>();
  const [inputAmount, setInputAmount] = useState<string | undefined>();

  const stETHDepositHelper = useSTETHDepositHelper(vaultVersion);

  const { contract, getMinSTETHAmount } = useLidoCurvePool();

  const earnVault = useVaultContract(vaultOption);

  const loadingText = useLoadingText();

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
  const [withdrawOption, setWithdrawOption] =
    useState<V2WithdrawOption>(v2WithdrawOption);
  const [signature, setSignature] = useState<DepositSignature | undefined>();
  const [amount, amountStr] = useMemo(() => {
    try {
      const amount = inputAmount
        ? parseUnits(inputAmount, decimals)
        : BigNumber.from(0);
      return [amount, amount.toString()];
    } catch (err) {
      return [BigNumber.from(0), "0"];
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

  useEffect(() => {
    // Fetch stETH rate
    if (vaultOption === "rEARN-stETH" && isNoApproveToken(depositAsset)) {
      if (!amount.isZero()) {
        setMinSTETHAmount(undefined);
        getMinSTETHAmount(amount).then((amt) => {
          setMinSTETHAmount(amt);
        });
        return;
      }
      setMinSTETHAmount(BigNumber.from(0));
    }
  }, [amount, asset, depositAsset, getMinSTETHAmount, vaultOption]);

  const cleanupEffects = useCallback(() => {
    setTxhash(undefined);
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
    if (step === STEPS.submittedStep && txhash) {
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

  const handleSetInputAmount = useCallback((inputAmount) => {
    setInputAmount(
      inputAmount && parseFloat(inputAmount) < 0 ? "" : inputAmount
    );
  }, []);
  const handleSwapCurveAndDepositSTETH = useCallback(async () => {
    // Subtract 0.5% slippage from exchange rate to get min steth
    const minSTETHAmount = await getMinSTETHAmount(amount);
    if (contract && minSTETHAmount) {
      return stETHDepositHelper?.deposit(minSTETHAmount, { value: amount });
    }
  }, [amount, contract, getMinSTETHAmount, stETHDepositHelper]);

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
            switch (vaultOption) {
              case "rEARN-stETH":
                if (isNoApproveToken(depositAsset)) {
                  res = await handleSwapCurveAndDepositSTETH();
                } else {
                  res = await vault.deposit(amountStr);
                }
                break;
              default:
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
                break;
            }
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
      <FormStep
        actionType={actionType}
        inputAmount={inputAmount}
        onClickUpdateInput={handleSetInputAmount}
        onClickUpdateWithdrawOption={setWithdrawOption}
        onClickConfirmButton={handleClickNextButton}
        asset={asset}
        vaultOption={vaultOption}
        vaultVersion={vaultVersion}
        show={show}
        showSwapDepositAsset={VaultAllowedDepositAssets[vaultOption].length > 1}
        earnHandleDepositAssetChange={earnHandleDepositAssetChange}
      />
    ),
    1: (
      <PreviewStep
        actionType={actionType}
        amount={amount}
        estimatedSTETHDepositAmount={
          minSTETHAmount
            ? `~${parseFloat(formatUnits(minSTETHAmount, 18)).toFixed(4)} stETH`
            : loadingText
        }
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
    2: <TransactionStep color={color} />,
    3: <TransactionStep txhash={txhash} color={color} />,
  };

  return <>{stepComponents[step]}</>;
};

export default ActionSteps;
