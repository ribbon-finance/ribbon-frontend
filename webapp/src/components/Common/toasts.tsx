import { BigNumber } from "ethers";
import React, { useCallback, useMemo, useState } from "react";

import { getAssets } from "shared/lib/constants/constants";
import { usePendingTransactions } from "shared/lib/hooks/pendingTransactionsContext";
import { PendingTransaction } from "shared/lib/store/types";
import { getAssetDecimals, getAssetDisplay } from "shared/lib/utils/asset";
import { formatBigNumber } from "shared/lib/utils/math";
import { capitalize } from "shared/lib/utils/text";
import { productCopies } from "shared/lib/components/Product/productCopies";
import Toast from "shared/lib/components/Common/BaseToast";
import PendingToast from "./PendingToast";
import { getVaultColor } from "shared/lib/utils/vault";

/**
 * TODO: Temporary disabled
 * In the future, we should seperate out wrong network service from useVaultData
 * As currently we does not allow connection from "wrong network", this toast is not performing the intended behavior as well
 */
// export const WrongNetworkToast = () => {
//   const [showToast, setShowToast] = useState(false);
//   const [shownOnce, setShownOnce] = useState(false);
//   const { status, error } = useVaultData(VaultList[0]);
//   const networkName = capitalize(getDefaultNetworkName());

//   useEffect(() => {
//     if (status === "error" && error === "wrong_network" && !shownOnce) {
//       setShowToast(true);
//       setShownOnce(true);
//     }
//   }, [status, error, setShowToast, shownOnce]);

//   const onClose = useCallback(() => {
//     setShowToast(false);
//   }, [setShowToast]);

//   return (
//     <Toast
//       show={showToast}
//       onClose={onClose}
//       type="error"
//       title="wrong network"
//       subtitle={`Please switch to ${networkName}`}
//     ></Toast>
//   );
// };

type TxStatuses = "processing" | "success" | "error" | undefined;

export const TxStatusToast = () => {
  const { pendingTransactions, transactionsCounter } = usePendingTransactions();

  const [showedPendingTxCounter, setShowPendingTxCounter] =
    useState(transactionsCounter);

  const [status, currentTx] = useMemo(() => {
    const tailTx = pendingTransactions[pendingTransactions.length - 1];

    if (!tailTx) {
      return [undefined, undefined];
    }

    /**
     * We keep track of migrate type for processing statuses
     */
    if (tailTx.type === "migrate") {
      return [(tailTx.status || "processing") as TxStatuses, tailTx];
    }

    return [tailTx.status, tailTx];
  }, [pendingTransactions]);

  const getAmountFormatted = useCallback((_currentTx: PendingTransaction) => {
    switch (_currentTx.type) {
      case "deposit":
      case "withdraw":
      case "migrate":
        return formatBigNumber(
          BigNumber.from(_currentTx.amount),
          getAssetDecimals(getAssets(_currentTx.vault))
        );
      case "transfer":
        return formatBigNumber(
          BigNumber.from(_currentTx.amount),
          getAssetDecimals(getAssets(_currentTx.transferVault))
        );
      default:
        return _currentTx.amount;
    }
  }, []);

  const getActionTitle = useCallback((_currentTx: PendingTransaction) => {
    switch (_currentTx.type) {
      case "rewardClaim":
        return "Reward Claim";
      default:
        return capitalize(_currentTx.type);
    }
  }, []);

  const getSubtitle = useCallback(
    (_currentTx: PendingTransaction) => {
      const amountFormatted = getAmountFormatted(_currentTx);

      switch (_currentTx.type) {
        case "approval":
          return `Your ${getAssetDisplay(
            getAssets(_currentTx.vault)
          )} is ready to deposit`;
        case "stakingApproval":
          return `Your ${_currentTx.stakeAsset} is ready to stake`;
        case "withdraw":
          return `${amountFormatted} ${getAssetDisplay(
            getAssets(_currentTx.vault)
          )} withdrawn from ${productCopies[_currentTx.vault].title}`;
        case "deposit":
          return `${amountFormatted} ${getAssetDisplay(
            getAssets(_currentTx.vault)
          )} deposited into ${productCopies[_currentTx.vault].title}`;
        case "claim":
        case "rewardClaim":
          return `${amountFormatted} $RBN claimed`;
        case "stake":
          return `${amountFormatted} ${_currentTx.stakeAsset} staked`;
        case "unstake":
          return `${amountFormatted} ${_currentTx.stakeAsset} unstaked`;
        case "transfer":
          const receiveVault = _currentTx.receiveVault;
          return `${amountFormatted} ${getAssetDisplay(
            getAssets(receiveVault)
          )} transferred to ${productCopies[receiveVault].title}`;
        case "migrate":
          return `${amountFormatted} migrated to ${
            productCopies[_currentTx.vault].title
          } V2`;
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
            switch (currentTx.type) {
              case "approval":
                return `Please try approving ${getAssetDisplay(
                  getAssets(currentTx.vault)
                )} again`;
              case "stakingApproval":
                return `Please try approving ${currentTx.stakeAsset} again`;
              default:
                return "Please resubmit transaction";
            }
          })()}
        />
      );
    case "processing":
      return (
        <PendingToast
          title="MIGRATING FUNDS"
          color={
            currentTx.type === "migrate" ? getVaultColor(currentTx.vault!) : ""
          }
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
          title={`${getActionTitle(currentTx)} successful`}
          subtitle={getSubtitle(currentTx)}
        />
      );
  }
};
