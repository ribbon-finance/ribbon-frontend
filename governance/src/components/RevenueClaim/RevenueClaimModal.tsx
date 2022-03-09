import React, { useCallback, useEffect, useMemo, useState } from "react";
import BasicModal from "shared/lib/components/Common/BasicModal";
import useVeRBNRewards from "../../hooks/useVERBNRewards";
import useWeb3Wallet from "shared/lib/hooks/useWeb3Wallet";
import { BigNumber } from "ethers";
import RevenueClaimForm from "./RevenueClaimForm";
import RevenueClaimPreview from "./RevenueClaimPreview";
import ModalTransactionContent from "../Shared/ModalTransactionContent";
import { PendingTransaction } from "shared/lib/store/types";
import { usePendingTransactions } from "shared/lib/hooks/pendingTransactionsContext";
import { formatBigNumberAmount } from "shared/lib/utils/math";
import { getAssetDecimals } from "shared/lib/utils/asset";

interface RewardsCalculatorModalProps {
  show: boolean;
  onClose: () => void;
}

const revenueClaimModes = ["form", "preview", "transaction"] as const;
type RevenueModalMode = typeof revenueClaimModes[number];
const revenueClaimModalHeight: { [mode in RevenueModalMode]: number } = {
  form: 576,
  preview: 398,
  transaction: 412,
};

const RevenueClaimModal: React.FC<RewardsCalculatorModalProps> = ({
  show,
  onClose,
}) => {
  const { account, ethereumProvider } = useWeb3Wallet();
  const veRBNRewards = useVeRBNRewards();

  // TODO: - Retrieve vault revenue
  // TODO: - Retrieve Share of unlock penalty

  // CURRENT STEP
  const [currentMode, setCurrentMode] = useState<RevenueModalMode>("form");
  const { addPendingTransaction } = usePendingTransactions();
  const [currentPendingTransaction, setCurrentPendingTransaction] =
    useState<PendingTransaction>();

  // CONTRACT VALUES
  const [vaultRevenue, setVaultRevenue] = useState<BigNumber>();
  const [unlockPenalty, setUnlockPenalty] = useState<BigNumber>();

  // FORM TOGGLE
  const [claimVaultRevenue, setClaimVaultRevenue] = useState(false);
  const [claimUnlockPenalty, setClaimUnlockPenalty] = useState(false);
  const [lockToVERBN, setlockToVERBN] = useState(false);

  // Fetch rewards
  useEffect(() => {
    if (veRBNRewards && account) {
      veRBNRewards.rewards(account).then((rewards: BigNumber) => {
        setUnlockPenalty(() => rewards);
      });
    }
  }, [veRBNRewards, account]);

  // Fetch penalty
  useEffect(() => {
    // TODO: - Retrieve penalty
  }, [account]);

  const onModalClose = useCallback(() => {
    setCurrentMode("form");
    onClose();
  }, [onClose]);

  const onClaim = useCallback(async () => {
    setCurrentMode("transaction");
    // TODO: - FeeDistributor.claim()
    const pendingTx: PendingTransaction = {
      type: "protocolRevenueClaim",
      txhash:
        "0xc4006e01a847d1a0ce7349cc9b92391d1bef7f5e76f8f8d56479197f6d07175a",
      amountUSDC: vaultRevenue
        // ? formatBigNumberAmount(vaultRevenue, getAssetDecimals("USDC"))
        ? "100.23K"
        : "0",
      amountRBN: unlockPenalty
        // ? formatBigNumberAmount(unlockPenalty, getAssetDecimals("RBN"))
        ? "100.23K"
        : "0",
    };
    addPendingTransaction(pendingTx);

    // await ethereumProvider?.waitForTransaction(pendingTx.txhash, 2)

    // TODO: - Testing code. Actually wait for tx hash in the future
    setTimeout(() => {
      setCurrentPendingTransaction(pendingTx);
      setTimeout(() => {
        setCurrentPendingTransaction(undefined);
        onModalClose();
      }, 3000);
    }, 2000);
  }, [addPendingTransaction, onModalClose, vaultRevenue, unlockPenalty]);

  const modalContent = useMemo(() => {
    switch (currentMode) {
      case "form":
        return (
          <RevenueClaimForm
            vaultRevenue={vaultRevenue}
            unlockPenalty={unlockPenalty}
            toggleProps={{
              claimVaultRevenue,
              setClaimVaultRevenue,
              claimUnlockPenalty,
              setClaimUnlockPenalty,
              lockToVERBN,
              setlockToVERBN,
            }}
            onPreviewClaim={() => setCurrentMode("preview")}
          />
        );
      case "preview":
        return (
          <RevenueClaimPreview
            onBack={() => setCurrentMode("form")}
            onClaim={onClaim}
            claimVaultRevenue={claimVaultRevenue}
            claimUnlockPenalty={claimUnlockPenalty}
            lockToVERBN={lockToVERBN}
          />
        );
      case "transaction":
        return (
          <ModalTransactionContent
            title={"Confirm Transaction"}
            txhash={currentPendingTransaction?.txhash}
          />
        );
    }
  }, [
    currentPendingTransaction,
    currentMode,
    vaultRevenue,
    unlockPenalty,
    claimVaultRevenue,
    claimUnlockPenalty,
    lockToVERBN,
    onClaim,
  ]);

  return (
    <BasicModal
      show={show}
      headerBackground={currentMode === "form" || currentMode === "transaction"}
      height={revenueClaimModalHeight[currentMode]}
      onClose={onModalClose}
      animationProps={{
        key: currentMode,
        transition: {
          duration: 0.25,
          type: "keyframes",
          ease: "easeInOut",
        },
        initial: {
          x: 50,
          opacity: 0,
        },
        animate: {
          x: 0,
          opacity: 1,
        },
        exit: {
          x: -50,
          opacity: 0,
        },
      }}
    >
      {modalContent}
    </BasicModal>
  );
};

export default RevenueClaimModal;
