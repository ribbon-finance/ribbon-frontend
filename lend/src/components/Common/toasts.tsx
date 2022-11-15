import { useCallback, useContext, useMemo, useState } from "react";
import { getAssets } from "../../constants/constants";
import { usePendingTransactions } from "../../hooks/pendingTransactionsContext";
import { PendingTransaction } from "../../store/types";
import { getAssetDecimals, getAssetDisplay } from "../../utils/asset";
import { capitalize } from "shared/lib/utils/text";
import Toast from ".//BaseToast";
import { formatBigNumber } from "../../utils/math";
import { BigNumber } from "ethers";
import { ReferralContext } from "../../hooks/referralContext";
import { SecondaryText } from "shared/lib/designSystem";
import { useEffect } from "react";

const getReferralText = (
  type: "Referee" | "Referrer",
  amount: number,
  referralCode?: string
) => {
  switch (type) {
    case "Referee":
      return (
        <span>
          <SecondaryText fontSize={12} lineHeight={16} className="mt-1">
            You earned
          </SecondaryText>
          <SecondaryText
            fontSize={12}
            lineHeight={16}
            color="#FFFFFF"
            className="mt-1"
          >
            {` ${amount} RBN `}
          </SecondaryText>
          <SecondaryText fontSize={12} lineHeight={16} className="mt-1">
            from using referral code
          </SecondaryText>
          <SecondaryText
            fontSize={12}
            lineHeight={16}
            color="#FFFFFF"
            className="mt-1"
          >
            {` ${referralCode}`}
          </SecondaryText>
        </span>
      );
    case "Referrer":
      return (
        <span>
          <SecondaryText fontSize={12} lineHeight={16} className="mt-1">
            You earned
          </SecondaryText>
          <SecondaryText
            fontSize={12}
            lineHeight={16}
            color="#FFFFFF"
            className="mt-1"
          >
            {` ${amount} RBN `}
          </SecondaryText>
          <SecondaryText fontSize={12} lineHeight={16} className="mt-1">
            from referring new depositors
          </SecondaryText>
        </span>
      );
  }
};

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
          getAssetDecimals(getAssets(_currentTx.pool))
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
            getAssets(_currentTx.pool)
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

export const ReferralStatusToast = () => {
  const { referralNotifications, referralLoading, referralCode } =
    useContext(ReferralContext);

  const [currShowState, setCurrShowState] = useState(false);

  useEffect(() => {
    if (referralNotifications.length > 0 && !referralLoading) {
      setCurrShowState(true);
    }
  }, [referralNotifications, referralLoading, referralCode]);

  const notifications = useMemo(() => {
    return (
      <>
        {referralNotifications.map((referralNotification) => (
          <Toast
            show={currShowState}
            onClose={() => setCurrShowState(false)}
            key={referralNotification.recordID}
            type="referral"
            title={`Referral Reward Earned`}
            subtitle={""} // Unused, will be overwritten by passed referralText
            referralText={getReferralText(
              referralNotification.type,
              referralNotification.amount,
              referralCode
            )}
          ></Toast>
        ))}
      </>
    );
  }, [currShowState, referralNotifications, referralCode]);

  return notifications;
};
