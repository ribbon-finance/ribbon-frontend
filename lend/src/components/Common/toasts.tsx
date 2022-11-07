import React, { useCallback, useMemo, useState } from "react";
import { getAssets } from "../../constants/constants";
import { usePendingTransactions } from "../../hooks/pendingTransactionsContext";
import { PendingTransaction } from "../../store/types";
import { getAssetDecimals, getAssetDisplay } from "../../utils/asset";
import { capitalize } from "shared/lib/utils/text";
import Toast from ".//BaseToast";
import { formatBigNumber } from "../../utils/math";
import { BigNumber } from "ethers";

export const TxStatusToast = () => {
  const { pendingTransactions, transactionsCounter } = usePendingTransactions();

  const [showedPendingTxCounter, setShowPendingTxCounter] =
    useState(transactionsCounter);

  const [status, currentTx] = useMemo(() => {
    const tailTx = pendingTransactions[pendingTransactions.length - 1];

    if (!tailTx) {
      return [undefined, undefined];
    }

    return [tailTx.status, tailTx];
  }, [pendingTransactions]);

  const getAmountFormatted = useCallback((_currentTx: PendingTransaction) => {
    switch (_currentTx.type) {
      case "deposit":
      case "withdraw":
        return formatBigNumber(
          BigNumber.from(_currentTx.amount),
          getAssetDecimals(getAssets(_currentTx.vault))
        );
      default:
        return _currentTx.amount;
    }
  }, []);

  const getActionTitle = useCallback((_currentTx: PendingTransaction) => {
    switch (_currentTx.type) {
      case "claim":
        return "RBN Claim";
      default:
        return `${capitalize(_currentTx.type)}`;
    }
  }, []);

  const getSubtitle = useCallback(
    (_currentTx: PendingTransaction) => {
      const amountFormatted = getAmountFormatted(_currentTx);

      switch (_currentTx.type) {
        case "withdraw":
          return `${amountFormatted} ${getAssetDisplay(
            getAssets(_currentTx.vault)
          )} withdrawn`;
        case "deposit":
          const referrerCode = sessionStorage.getItem("code");
          if (referrerCode) {
            sessionStorage.removeItem("code");
            return `${amountFormatted} ${getAssetDisplay(
              _currentTx.asset
            )} deposited using referral code ${referrerCode}`;
          } else {
            return `${amountFormatted} ${getAssetDisplay(
              _currentTx.asset
            )} deposited`;
          }
        case "claim":
          return `${amountFormatted} RBN claimed`;
        default:
          return "";
      }
    },
    [getAmountFormatted]
  );

  if (!status || !currentTx) {
    return null;
  }

  switch (status) {
    case "error":
      return (
        <Toast
          show={showedPendingTxCounter !== transactionsCounter}
          onClose={() => setShowPendingTxCounter(transactionsCounter)}
          type="error"
          title={`${getActionTitle(currentTx)} failed`}
          subtitle={(() => {
            return "Please resubmit transaction";
          })()}
        />
      );
    case "success":
      return (
        <Toast
          show={showedPendingTxCounter !== transactionsCounter}
          onClose={() => setShowPendingTxCounter(transactionsCounter)}
          type={
            currentTx.type === "claim" || currentTx.type === "rewardClaim"
              ? "claim"
              : "success"
          }
          title={(() => {
            switch (currentTx.type) {
              case "claim":
                return getActionTitle(currentTx);
              default:
                return getActionTitle(currentTx) + " success";
            }
          })()}
          subtitle={getSubtitle(currentTx)}
        />
      );
  }
};
