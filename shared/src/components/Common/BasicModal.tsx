import React, { RefAttributes, useEffect } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import { AnimatePresence, HTMLMotionProps, motion } from "framer-motion";

import { BaseModal, BaseModalHeader } from "../../designSystem";
import theme from "../../designSystem/theme";
import colors from "../../designSystem/colors";
import MenuButton from "./MenuButton";

const StyledModal = styled(BaseModal)<{
  height: number;
  maxWidth: number;
  theme?: string;
}>`
  .modal-dialog {
    width: 95vw;
    max-width: ${(props) => props.maxWidth}px;
    margin-left: auto;
    margin-right: auto;
  }

  .modal-content {
    transition: min-height 0.25s;
    min-height: ${(props) => props.height}px;
    overflow: hidden;
    border: 1px solid ${colors.border};

    ${(props) =>
      props.theme
        ? `
            background-color: ${props.theme}0A;
          `
        : ``}}
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

const CloseButton = styled.div<{ theme?: string }>`
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: ${theme.border.width} ${theme.border.style}
    ${(props) => (props.theme ? `${colors.primaryText}0A` : `${colors.border}`)};
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
  background: ${colors.background.one};
  height: 72px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
`;

interface BasicModalProps {
  show: boolean;
  height: number;
  maxWidth?: number;
  onClose: () => void;
  closeButton?: boolean;
  backButton?: {
    onClick: () => void;
  };
  children: JSX.Element;
  animationProps?: HTMLMotionProps<"div"> & RefAttributes<HTMLDivElement>;
  headerBackground?: boolean;
  backgroundColor?: string;
  theme?: string;
}

const BasicModal: React.FC<BasicModalProps> = ({
  show,
  height,
  maxWidth = 343,
  onClose,
  closeButton = true,
  backButton,
  children,
  animationProps = {},
  headerBackground = false,
  backgroundColor,
  theme,
}) => {
  useEffect(() => {
    if (show) {
      document.getElementById("root")!.classList.add("backdrop-filter");
    } else {
      document.getElementById("root")!.classList.remove("backdrop-filter");
    }
  }, [show]);

  return (
    <StyledModal
      show={show}
      centered
      height={height}
      maxWidth={maxWidth}
      onHide={onClose}
      backdrop
      theme={theme}
      backgroundColor={backgroundColor}
    >
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
};

export default BasicModal;
