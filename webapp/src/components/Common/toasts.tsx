import { BigNumber } from "ethers";
import React, { useCallback, useEffect, useState } from "react";
import { VaultList } from "../../constants/constants";
import usePendingTransactions from "../../hooks/usePendingTransactions";
import useVaultData from "../../hooks/useVaultData";
import { useWeb3Context } from "../../hooks/web3Context";
import { PendingTransaction } from "../../store/types";
import { getDefaultNetworkName } from "../../utils/env";
import { formatBigNumber } from "../../utils/math";
import { capitalize } from "../../utils/text";
import Toast from "./BaseToast";

export const WrongNetworkToast = () => {
  const [showToast, setShowToast] = useState(false);
  const [shownOnce, setShownOnce] = useState(false);
  const { status, error } = useVaultData(VaultList[0]);
  const networkName = capitalize(getDefaultNetworkName());

  useEffect(() => {
    if (status === "error" && error === "wrong_network" && !shownOnce) {
      setShowToast(true);
      setShownOnce(true);
    }
  }, [status, error, setShowToast, shownOnce]);

  const onClose = useCallback(() => {
    setShowToast(false);
  }, [setShowToast]);

  return (
    <Toast
      show={showToast}
      onClose={onClose}
      type="error"
      title="wrong network"
      subtitle={`Please switch to ${networkName}`}
    ></Toast>
  );
};

type TxStatuses = "success" | "error" | null;

export const TxStatusToast = () => {
  const [
    pendingTransactions,
    setPendingTransactions,
  ] = usePendingTransactions();

  const [status, setStatus] = useState<TxStatuses>(null);
  const [currentTx, setCurrentTx] = useState<PendingTransaction | null>(null);
  const { provider } = useWeb3Context();

  useEffect(() => {
    if (provider && pendingTransactions.length) {
      (async () => {
        // we query from the tail of the pendingTransactions
        const tailTx = pendingTransactions[pendingTransactions.length - 1];
        const receipt = await provider.waitForTransaction(tailTx.txhash, 1);

        setStatus(receipt.status ? "success" : "error");
        setCurrentTx(tailTx);
        setPendingTransactions((pendingTransactions) => {
          return pendingTransactions.filter(
            (tx) => tx.txhash !== tailTx.txhash
          );
        });
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingTransactions, setStatus, setCurrentTx]);

  if (status && currentTx) {
    const { type, amount } = currentTx;
    const amountFormatted = formatBigNumber(BigNumber.from(amount));

    if (status === "error") {
      return (
        <Toast
          show={status === "error"}
          onClose={() => setStatus(null)}
          type="error"
          title={`${type} failed`}
          subtitle="Please resubmit transaction"
        ></Toast>
      );
    }

    const word = type === "deposit" ? "Deposit" : "Withdrawal";

    return (
      <Toast
        show={status === "success"}
        onClose={() => setStatus(null)}
        type="success"
        title={`${word} successful`}
        subtitle={`${amountFormatted} ETH ${
          type === "deposit" ? "deposited into" : "withdrawn from"
        } T-100-E`}
      ></Toast>
    );
  }
  return null;
};
