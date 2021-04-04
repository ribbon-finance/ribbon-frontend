import React, { useCallback, useEffect, useState } from "react";
import useVaultData from "../../hooks/useVaultData";
import { getDefaultNetworkName } from "../../utils/env";
import { capitalize } from "../../utils/text";
import Toast from "./Toast";

export const WrongNetworkToast = () => {
  const [showToast, setShowToast] = useState(false);
  const [shownOnce, setShownOnce] = useState(false);
  const { status, error } = useVaultData();
  const networkName = capitalize(getDefaultNetworkName());

  useEffect(() => {
    if (status === "error" && error === "wrong_network" && !shownOnce) {
      setShowToast(true);
      setShownOnce(true);
    }
  }, [status, error, setShowToast, setShowToast, shownOnce]);

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

interface TxToastProps {
  type: "deposit" | "withdraw";
}

interface TxSuccessfulToastProps extends TxToastProps {
  amountStr: string;
}

export const TxSuccessfulToast: React.FC<TxSuccessfulToastProps> = ({
  type,
  amountStr,
}) => {
  return (
    <Toast
      type="success"
      title={`${type} successful`}
      subtitle={`${amountStr} ETH ${
        type === "deposit" ? "deposited into" : "withdrawn from"
      } T-100-E`}
    ></Toast>
  );
};

export const TxFailedToast: React.FC<TxToastProps> = ({ type }) => {
  return (
    <Toast
      type="success"
      title={`${type} failed`}
      subtitle="Please resubmit transaction"
    ></Toast>
  );
};
