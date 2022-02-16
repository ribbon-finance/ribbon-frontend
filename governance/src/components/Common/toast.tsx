import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";

import { usePendingTransactions } from "shared/lib/hooks/pendingTransactionsContext";
import { PendingTransaction } from "shared/lib/store/types";
import { getAssetDisplay } from "shared/lib/utils/asset";
import { capitalize } from "shared/lib/utils/text";
import Toast from "shared/lib/components/Common/BaseToast";
import Logo, { ThemedLogo } from "shared/lib/assets/icons/logo";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";

const ThemedLogoWithBorder = styled(ThemedLogo)`
  border: ${theme.border.width} ${theme.border.style} ${colors.red};
  border-radius: 100px;
`;

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

  const getLogo = useCallback((_currentTx: PendingTransaction) => {
    switch (_currentTx.type) {
      case "governanceApproval":
        return <Logo />;
      case "governanceStake":
      case "governanceIncreaseAmount":
      case "governanceIncreaseDuration":
        return <ThemedLogoWithBorder theme={colors.red} />;
      case "governanceUnstake":
        return <ThemedLogo theme={colors.red} />;
    }
  }, []);

  const getActionTitle = useCallback((_currentTx: PendingTransaction) => {
    switch (_currentTx.type) {
      case "governanceApproval":
        return "RBN APPROVED";
      case "governanceStake":
        return "RBN LOCKED";
      case "governanceIncreaseAmount":
        return "LOCK INCREASED";
      case "governanceIncreaseDuration":
        return "LOCK DURATION INCREASED";
      case "governanceUnstake":
        return "RBN UNLOCKED";
      default:
        return `${capitalize(_currentTx.type)}`;
    }
  }, []);

  const getSubtitle = useCallback((_currentTx: PendingTransaction) => {
    switch (_currentTx.type) {
      case "governanceApproval":
        return "Your RBN is ready to lock";
      case "governanceStake":
      case "governanceIncreaseAmount":
      case "governanceIncreaseDuration":
        return `${_currentTx.amount} RBN Locked till ${_currentTx.expiry.format(
          "MMM, Do YYYY"
        )}`;
      case "governanceUnstake":
        return `${_currentTx.amount} RBN unlocked`;
      default:
        return "";
    }
  }, []);

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
          title={`${getActionTitle(currentTx)} FAILED`}
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
          title={`${getActionTitle(currentTx)} SUCCESSFULLY`}
          subtitle={getSubtitle(currentTx)}
          icon={getLogo(currentTx)}
        />
      );
  }
};
