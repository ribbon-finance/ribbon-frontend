import React, { useCallback, useState } from "react";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { useWeb3React } from "@web3-react/core";

import { BaseModal, BaseModalHeader } from "shared/lib/designSystem";
import { useWeb3Context } from "shared/lib/hooks/web3Context";
import theme from "shared/lib/designSystem/theme";
import colors from "shared/lib/designSystem/colors";

import AirdropInfo from "./AirdropInfo";
import MenuButton from "../Header/MenuButton";
import RBNClaimModalContent from "../Common/RBNClaimModalContent";
import useMerkleDistributor from "../../hooks/useMerkleDistributor";
import useAirdrop from "../../hooks/useAirdrop";
import usePendingTransactions from "../../hooks/usePendingTransactions";

const StyledModal = styled(BaseModal)`
  .modal-dialog {
    max-width: 343px;
    margin-left: auto;
    margin-right: auto;
  }

  .modal-content {
    min-height: 580px;
    overflow: hidden;
  }
`;

const ModalContent = styled(motion.div)`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  padding: 16px;
`;

const CloseButton = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: 48px;
  color: ${colors.text};
  z-index: 2;
`;

interface AirdropModalProps {
  show: boolean;
  onClose: () => void;
}

const AirdropModal: React.FC<AirdropModalProps> = ({ show, onClose }) => {
  const [step, setStep] = useState<"info" | "claim" | "claiming" | "claimed">(
    "info"
  );
  const merkleDistributor = useMerkleDistributor();
  const { account } = useWeb3React();
  const { provider } = useWeb3Context();
  const airdrop = useAirdrop();
  const [, setPendingTransactions] = usePendingTransactions();

  const claimAirdrop = useCallback(async () => {
    if (!airdrop) {
      return;
    }

    if (!merkleDistributor) {
      return;
    }

    setStep("claim");

    try {
      const tx = await merkleDistributor.claim(
        airdrop.proof.index,
        account,
        airdrop.proof.amount,
        airdrop.proof.proof
      );

      setStep("claiming");

      const txhash = tx.hash;

      setPendingTransactions((pendingTransactions) => [
        ...pendingTransactions,
        {
          txhash,
          type: "claim",
          amount: airdrop.total.toLocaleString(),
        },
      ]);

      await provider.waitForTransaction(txhash);
      setStep("claimed");
    } catch (err) {
      setStep("info");
    }
  }, [
    account,
    airdrop,
    merkleDistributor,
    setStep,
    setPendingTransactions,
    provider,
  ]);

  const handleClose = useCallback(() => {
    onClose();
    if (step === "claim" || step === "claimed") {
      setStep("info");
    }
  }, [onClose, step]);

  return (
    <StyledModal show={show} onHide={handleClose} centered backdrop={true}>
      <BaseModalHeader>
        <CloseButton role="button" onClick={handleClose}>
          <MenuButton
            isOpen={true}
            onToggle={handleClose}
            size={20}
            color={"#FFFFFFA3"}
          />
        </CloseButton>
      </BaseModalHeader>
      <Modal.Body>
        <AnimatePresence initial={false}>
          <ModalContent
            key={step}
            transition={{
              duration: 0.25,
              type: "keyframes",
              ease: "easeInOut",
            }}
            initial={
              step === "info" || step === "claim"
                ? {
                    x: 50,
                    opacity: 0,
                  }
                : {}
            }
            animate={
              step === "info" || step === "claim"
                ? {
                    x: 0,
                    opacity: 1,
                  }
                : {}
            }
            exit={
              step === "info"
                ? {
                    x: -50,
                    opacity: 0,
                  }
                : {}
            }
          >
            {step === "info" ? (
              <AirdropInfo onClaim={claimAirdrop} />
            ) : (
              <RBNClaimModalContent step={step} setStep={setStep} />
            )}
          </ModalContent>
        </AnimatePresence>
      </Modal.Body>
    </StyledModal>
  );
};

export default AirdropModal;
