import { BigNumber } from "ethers";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  getAssets,
  VaultList,
  VaultOptions,
  VaultVersion,
} from "shared/lib/constants/constants";
import { usePendingTransactions } from "shared/lib/hooks/pendingTransactionsContext";
import { PendingTransaction } from "shared/lib/store/types";
import { getAssetDecimals, getAssetDisplay } from "shared/lib/utils/asset";
import { formatBigNumber, isPracticallyZero } from "shared/lib/utils/math";
import { capitalize } from "shared/lib/utils/text";
import { productCopies } from "shared/lib/components/Product/productCopies";
import Toast from "shared/lib/components/Common/BaseToast";
import PendingToast from "./PendingToast";
import { getVaultColor } from "shared/lib/utils/vault";
import { useV2VaultsData } from "shared/lib/hooks/web3DataContext";
import { useVaultsPriceHistory } from "shared/lib/hooks/useVaultPerformanceUpdate";
import { parseUnits } from "ethers/lib/utils";

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
      case "withdrawInitiation":
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
      case "withdrawInitiation":
        return "WITHDRAWAL INITIATED";
      default:
        return `${capitalize(_currentTx.type)}`;
    }
  }, []);

  const getSubtitle = useCallback(
    (_currentTx: PendingTransaction) => {
      const amountFormatted = getAmountFormatted(_currentTx);

      switch (_currentTx.type) {
        case "approval":
          return `Your ${getAssetDisplay(
            _currentTx.asset
          )} is ready to deposit`;
        case "stakingApproval":
          return `Your ${_currentTx.stakeAsset} is ready to stake`;
        case "withdrawInitiation":
          return `Initiated ${amountFormatted} ${getAssetDisplay(
            getAssets(_currentTx.vault)
          )} withdrawal from ${
            productCopies[_currentTx.vault].title
          }. You can complete your withdrawal any time after 12pm UTC on Friday.`;
        case "withdraw":
          return `${amountFormatted} ${getAssetDisplay(
            getAssets(_currentTx.vault)
          )} withdrawn from ${productCopies[_currentTx.vault].title}`;
        case "deposit":
          return `${amountFormatted} ${getAssetDisplay(
            _currentTx.asset
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
            switch (currentTx.type) {
              case "approval":
                return `Please try approving ${getAssetDisplay(
                  currentTx.asset
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
          title={getActionTitle(currentTx) + " success"}
          subtitle={getSubtitle(currentTx)}
        />
      );
  }
};

export const WithdrawReminderToast = () => {
  const { data } = useV2VaultsData();
  const [reminders, setReminders] = useState<
    {
      vault: { option: VaultOptions; version: VaultVersion };
      amount: BigNumber;
      shown?: boolean;
    }[]
  >([]);
  const [showReminderIndex, setShowReminderIndex] = useState<number>(0);
  const { data: priceHistories } = useVaultsPriceHistory();

  /**
   * Find vault that is ready to withdraw
   */
  useEffect(() => {
    VaultList.forEach((vault) => {
      const vaultData = data[vault as VaultOptions];
      const asset = getAssets(vault as VaultOptions);
      const decimals = getAssetDecimals(asset);
      const priceHistory = priceHistories.v2[vault as VaultOptions].find(
        (history) => history.round === vaultData.withdrawals.round
      );

      if (
        !isPracticallyZero(vaultData.withdrawals.shares, decimals) &&
        vaultData.withdrawals.round !== vaultData.round &&
        priceHistory
      ) {
        /**
         * Check if it had already indexed inside reminders
         */
        if (
          reminders.find(
            (reminder) =>
              reminder.vault.option === vault && reminder.vault.version === "v2"
          )
        ) {
          return;
        }

        setReminders((curr) =>
          curr.concat({
            vault: { option: vault as VaultOptions, version: "v2" },
            amount: vaultData.withdrawals.shares
              .mul(priceHistory.pricePerShare)
              .div(
                parseUnits(
                  "1",
                  getAssetDecimals(getAssets(vault as VaultOptions))
                )
              ),
          })
        );
      }
    }, []);
  }, [data, priceHistories.v2, reminders]);

  /**
   * Make sure index does not goes out of bound
   */
  useEffect(() => {
    const remindersNotShown = reminders.filter(
      (reminder) => !reminder.shown
    ).length;
    if (showReminderIndex >= remindersNotShown) {
      setShowReminderIndex(Math.max(remindersNotShown - 1, 0));
    }
  }, [reminders, showReminderIndex]);

  if (reminders.filter((reminder) => !reminder.shown).length > 0) {
    const currentReminder = reminders[showReminderIndex];
    return (
      <Toast
        show
        onClose={() =>
          setReminders((curr) =>
            curr.map((reminder, index) =>
              index === showReminderIndex
                ? { ...reminder, shown: true }
                : reminder
            )
          )
        }
        type="reminder"
        title="COMPLETE YOUR WITHDRAWALS"
        subtitle={`You can now complete your withdrawal of ${formatBigNumber(
          currentReminder.amount,
          getAssetDecimals(getAssets(currentReminder.vault.option))
        )} ${getAssetDisplay(
          getAssets(currentReminder.vault.option)
        )} from the ${productCopies[currentReminder.vault.option].title} vault`}
        extra={{ vaultOption: currentReminder.vault.option }}
      />
    );
  }

  return <></>;
};
