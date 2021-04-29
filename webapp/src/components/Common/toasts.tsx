import { BigNumber } from "ethers";
import React, { useCallback, useEffect, useState } from "react";
import {
  getAssets,
  VaultList,
  VaultOptions,
} from "shared/lib/constants/constants";
import usePendingTransactions from "../../hooks/usePendingTransactions";
import useVaultData from "shared/lib/hooks/useVaultData";
import { useWeb3Context } from "shared/lib/hooks/web3Context";
import { Assets, PendingTransaction } from "shared/lib/store/types";
import { getAssetDecimals, getAssetDisplay } from "shared/lib/utils/asset";
import { getDefaultNetworkName } from "shared/lib/utils/env";
import { formatBigNumber } from "shared/lib/utils/math";
import { capitalize } from "../../utils/text";
import { productCopies } from "shared/lib/components/Product/productCopies";
import Toast from "shared/lib/components/Common/BaseToast";

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

  const renderSuccessTxSubtitle = useCallback(
    (
      type: "approval" | "deposit" | "withdraw",
      amountFormatted: string,
      vault: VaultOptions,
      asset: Assets
    ) => {
      switch (type) {
        case "approval":
          return `Your ${getAssetDisplay(asset)} is ready to deposit`;
        case "withdraw":
          return `${amountFormatted} ${getAssetDisplay(asset)} withdrawn into ${
            productCopies[vault].title
          }`;
        case "deposit":
          return `${amountFormatted} ${getAssetDisplay(asset)} deposited from ${
            productCopies[vault].title
          }`;
      }
    },
    []
  );

  if (status && currentTx) {
    const { type, amount, vault } = currentTx;
    const asset = getAssets(vault);
    const amountFormatted = formatBigNumber(
      BigNumber.from(amount),
      6,
      getAssetDecimals(asset)
    );

    if (status === "error") {
      return (
        <Toast
          show={status === "error"}
          onClose={() => setStatus(null)}
          type="error"
          title={`${type} failed`}
          subtitle={
            type === "approval"
              ? `Please try approving ${getAssetDisplay(asset)} again`
              : "Please resubmit transaction"
          }
        ></Toast>
      );
    }

    const word = capitalize(type);

    return (
      <Toast
        show={status === "success"}
        onClose={() => setStatus(null)}
        type="success"
        title={`${word} successful`}
        subtitle={renderSuccessTxSubtitle(type, amountFormatted, vault, asset)}
      ></Toast>
    );
  }
  return null;
};
