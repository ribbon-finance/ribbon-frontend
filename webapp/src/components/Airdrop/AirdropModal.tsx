import React, { useCallback, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import styled from "styled-components";

import { BaseModal, BaseModalHeader } from "shared/lib/designSystem";

import AirdropInfo from "./AirdropInfo";
import theme from "shared/lib/designSystem/theme";
import colors from "shared/lib/designSystem/colors";
import MenuButton from "../Header/MenuButton";
import { AnimatePresence, motion } from "framer-motion";
import AirdropClaim from "./AirdropClaim";

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

  const content = useMemo(() => {
    switch (step) {
      case "info":
        return <AirdropInfo onClaim={() => setStep("claim")} />;
      case "claim":
      case "claiming":
      case "claimed":
        return <AirdropClaim step={step} setStep={setStep} />;
    }
  }, [step]);

  const handleClose = useCallback(() => {
    onClose();
    if (step === "claim" || step === "claimed") {
      setStep("info");
    }
  }, [onClose, step]);

  return (
    <StyledModal show={show} onHide={handleClose} centered backdrop={true}>
      <BaseModalHeader>
        {
          <CloseButton role="button" onClick={handleClose}>
            <MenuButton
              isOpen={true}
              onToggle={handleClose}
              size={20}
              color={"#FFFFFFA3"}
            />
          </CloseButton>
        }
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
            {content}
          </ModalContent>
        </AnimatePresence>
      </Modal.Body>
    </StyledModal>
  );
};

export default AirdropModal;
