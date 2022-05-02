import React, { useCallback, useEffect, useMemo, useState } from "react";
import BasicModal from "shared/lib/components/Common/BasicModal";
import usePenaltyRewards from "../../hooks/usePenaltyRewards";
import useWeb3Wallet from "shared/lib/hooks/useWeb3Wallet";
import { formatBigNumberAmount } from "shared/lib/utils/math";
import { getAssetDecimals } from "shared/lib/utils/asset";
import { BigNumber } from "ethers";
import RevenueClaimForm from "./RevenueClaimForm";
import RevenueClaimPreview from "./RevenueClaimPreview";
import ModalTransactionContent from "../Shared/ModalTransactionContent";
import { PendingTransaction } from "shared/lib/store/types";
import { usePendingTransactions } from "shared/lib/hooks/pendingTransactionsContext";
import { ClaimType } from "./model";
import useFeeDistributor from "../../hooks/useFeeDistributor";

interface RewardsCalculatorModalProps {
  show: boolean;
  onClose: () => void;
}

const revenueClaimModes = ["form", "preview", "transaction"] as const;
type RevenueModalMode = typeof revenueClaimModes[number];

const RevenueClaimModal: React.FC<RewardsCalculatorModalProps> = ({
  show,
  onClose,
}) => {
  const { account, ethereumProvider } = useWeb3Wallet();
  const penaltyRewards = usePenaltyRewards();
  const feeDistributor = useFeeDistributor();

  // TODO: - Retrieve vault revenue
  // TODO: - Retrieve Share of unlock penalty

  // CURRENT STEP
  const [claimType, setClaimType] = useState<ClaimType>("revenue");
  const [currentMode, setCurrentMode] = useState<RevenueModalMode>("form");
  const { addPendingTransaction } = usePendingTransactions();
  const [currentPendingTransaction, setCurrentPendingTransaction] =
    useState<PendingTransaction>();

  // CONTRACT VALUES
  const [vaultRevenue, setVaultRevenue] = useState<BigNumber>();
  const [unlockPenalty, setUnlockPenalty] = useState<BigNumber>();
  const [nextRevenueDistributionDate, setNextRevenueDistributionDate] =
    useState<Date>();

  // Fetch rewards
  useEffect(() => {
    if (penaltyRewards && account) {
      penaltyRewards.callStatic["claim()"]().then((rewards: BigNumber) => {
        setUnlockPenalty(() => rewards);
      });
      penaltyRewards.last_token_time().then((time: BigNumber) => {
        // Weekly distributions, so add 7 days
        const seconds = time.toNumber() + 86400;
        setNextRevenueDistributionDate(new Date(seconds * 1000));
      });
    }
  }, [penaltyRewards, account]);

  // Fetch penalty
  useEffect(() => {
    if (feeDistributor && account) {
      feeDistributor.callStatic["claim()"]().then((rewards: BigNumber) => {
        setVaultRevenue(() => rewards);
      });
    }
  }, [feeDistributor, account]);

  const onModalClose = useCallback(() => {
    setCurrentMode("form");
    onClose();
  }, [onClose]);

  const onClaim = useCallback(async () => {
    setCurrentMode("transaction");

    try {
      let pendingTx: PendingTransaction | undefined = undefined;
      if (claimType === "revenue" && feeDistributor) {
        const tx = await feeDistributor["claim()"]();
        pendingTx = {
          type: "protocolRevenueClaim",
          txhash: tx.hash,
          amountETH: vaultRevenue
            ? formatBigNumberAmount(vaultRevenue, getAssetDecimals("WETH"))
            : "0",
        };
      } else if (claimType === "penalty" && penaltyRewards) {
        const tx = await penaltyRewards["claim()"]();
        pendingTx = {
          type: "protocolPenaltyClaim",
          txhash: tx.hash,
          amountRBN: unlockPenalty
            ? formatBigNumberAmount(unlockPenalty, getAssetDecimals("RBN"))
            : "0",
        };
      }

      if (pendingTx) {
        addPendingTransaction(pendingTx);
        setCurrentPendingTransaction(pendingTx);
        await ethereumProvider?.waitForTransaction(pendingTx.txhash, 2);
        setCurrentPendingTransaction(undefined);
        onModalClose();
      }
    } catch (error) {
      // Revert to previous step on error.
      setCurrentMode("preview");
    }
  }, [
    addPendingTransaction,
    onModalClose,
    vaultRevenue,
    unlockPenalty,
    claimType,
    ethereumProvider,
    feeDistributor,
    penaltyRewards,
  ]);

  const revenueClaimModalHeight = useMemo(() => {
    switch (currentMode) {
      case "form":
        return claimType === "penalty" ? 328 : 410;
      case "preview":
        return 340;
      case "transaction":
        return 412;
    }
  }, [currentMode, claimType]);

  const modalContent = useMemo(() => {
    switch (currentMode) {
      case "form":
        return (
          <RevenueClaimForm
            claimType={claimType}
            onClaimTypeChange={(value) => setClaimType(value)}
            vaultRevenue={vaultRevenue}
            unlockPenalty={unlockPenalty}
            nextDistributionDate={nextRevenueDistributionDate}
            onPreviewClaim={() => setCurrentMode("preview")}
          />
        );
      case "preview":
        return (
          <RevenueClaimPreview
            onBack={() => setCurrentMode("form")}
            onClaim={onClaim}
            claimType={claimType}
            vaultRevenue={vaultRevenue}
            unlockPenalty={unlockPenalty}
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
    onClaim,
    claimType,
    nextRevenueDistributionDate,
  ]);

  return (
    <BasicModal
      show={show}
      headerBackground={currentMode === "form" || currentMode === "transaction"}
      height={revenueClaimModalHeight}
      maxWidth={343}
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
