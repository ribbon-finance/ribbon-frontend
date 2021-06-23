import React, { RefAttributes } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import { AnimatePresence, HTMLMotionProps, motion } from "framer-motion";
import { BaseModal, BaseModalHeader } from "../../designSystem";
import theme from "../../designSystem/theme";
import colors from "../../designSystem/colors";
import MenuButton from "./MenuButton";

const StyledModal = styled(BaseModal)<{ height: number }>`
  .modal-dialog {
    max-width: 343px;
    margin-left: auto;
    margin-right: auto;
  }

  .modal-content {
    transition: min-height 0.25s;
    min-height: ${(props) => props.height}px;
    overflow: hidden;
  }
`;

const BackButton = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 48px;
  z-index: 2;

  & > i {
    color: #ffffff;
  }
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

const ModalContent = styled(motion.div)`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: -32px;
  left: 0;
  height: calc(100% + 32px);
  width: 100%;
  padding: 16px;
`;

const ModalHeaderBackground = styled.div`
  background: ${colors.pillBackground};
  height: 72px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
`;

interface BasicModalProps {
  show: boolean;
  height: number;
  onClose: () => void;
  closeButton?: boolean;
  backButton?: {
    onClick: () => void;
  };
  children: JSX.Element;
  animationProps?: HTMLMotionProps<"div"> & RefAttributes<HTMLDivElement>;
  headerBackground?: boolean;
}

const BasicModal: React.FC<BasicModalProps> = ({
  show,
  height,
  onClose,
  closeButton = true,
  backButton,
  children,
  animationProps = {},
  headerBackground = false,
}) => (
  <StyledModal show={show} centered height={height} onHide={onClose} backdrop>
    <BaseModalHeader>
      {/* Back button */}
      {backButton && (
        <BackButton role="button" onClick={backButton.onClick}>
          <i className="fas fa-arrow-left" />
        </BackButton>
      )}

      {/* Close Button */}
      {closeButton && (
        <CloseButton role="button" onClick={onClose}>
          <MenuButton isOpen onToggle={onClose} size={20} color="#FFFFFFA3" />
        </CloseButton>
      )}
    </BaseModalHeader>

    <Modal.Body>
      <AnimatePresence initial={false}>
        <ModalContent {...animationProps}>
          {children}
          {headerBackground && <ModalHeaderBackground />}
        </ModalContent>
      </AnimatePresence>
    </Modal.Body>
  </StyledModal>
);

export default BasicModal;
