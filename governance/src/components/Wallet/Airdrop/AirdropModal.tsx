import React, { useCallback, useState } from "react";
import { useWeb3Wallet } from "shared/lib/hooks/useWeb3Wallet";

import BasicModal from "shared/lib/components/Common/BasicModal";
import RBNClaimModalContent from "shared/lib/components/Common/RBNClaimModalContent";
import { usePendingTransactions } from "shared/lib/hooks/pendingTransactionsContext";
import { useWeb3Context } from "shared/lib/hooks/web3Context";
import useAirdrop from "../../../hooks/airdrop/useAirdrop";
import AirdropInfo from "./AirdropInfo";

interface AirdropModalProps {
  show: boolean;
  onClose: () => void;
}

const AirdropModal: React.FC<AirdropModalProps> = ({ show, onClose }) => {
  const [step, setStep] = useState<"info" | "claim" | "claiming" | "claimed">(
    "info"
  );
  const { account } = useWeb3Wallet();
  const { provider } = useWeb3Context();
  const { merkleDistributor, loading, airdropInfo } = useAirdrop();
  const { addPendingTransaction } = usePendingTransactions();

  const claimAirdrop = useCallback(async () => {
    if (!airdropInfo || !merkleDistributor || !account) {
      return;
    }

    setStep("claim");

    try {
      const tx = await merkleDistributor.claim(
        airdropInfo.proof.index,
        account,
        airdropInfo.proof.amount,
        airdropInfo.proof.proof
      );

      setStep("claiming");

      const txhash = tx.hash;

      addPendingTransaction({
        txhash,
        type: "claim",
        amount: airdropInfo.total.toLocaleString(),
      });

      await provider.waitForTransaction(txhash, 2);
      setStep("claimed");
    } catch (err) {
      console.error(err);
      setStep("info");
    }
  }, [
    account,
    addPendingTransaction,
    airdropInfo,
    merkleDistributor,
    setStep,
    provider,
  ]);

  const handleClose = useCallback(() => {
    onClose();
    if (step === "claim" || step === "claimed") {
      setStep("info");
    }
  }, [onClose, step]);

  return (
    <BasicModal
      show={show}
      onClose={handleClose}
      height={580}
      animationProps={{
        key: step,
        transition: {
          duration: 0.25,
          type: "keyframes",
          ease: "easeInOut",
        },
        initial:
          step === "info" || step === "claim"
            ? {
                x: 50,
                opacity: 0,
              }
            : {},
        animate:
          step === "info" || step === "claim"
            ? {
                x: 0,
                opacity: 1,
              }
            : {},
        exit:
          step === "info"
            ? {
                x: -50,
                opacity: 0,
              }
            : {},
      }}
    >
      {step === "info" ? (
        <AirdropInfo
          loading={loading}
          airdropInfo={airdropInfo}
          onClaim={claimAirdrop}
        />
      ) : (
        <RBNClaimModalContent step={step} type="rbn" />
      )}
    </BasicModal>
  );
};

export default AirdropModal;
