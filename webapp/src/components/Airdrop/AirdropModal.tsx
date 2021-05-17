import React, { useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import styled from "styled-components";

import { BaseModal, BaseModalHeader } from "shared/lib/designSystem";

import AirdropInfo from "./AirdropInfo";
import ButtonArrow from "shared/lib/components/Common/ButtonArrow";
import theme from "shared/lib/designSystem/theme";
import colors from "shared/lib/designSystem/colors";
import MenuButton from "../Header/MenuButton";

const StyledModal = styled(BaseModal)`
  .modal-dialog {
    max-width: 343px;
    margin-left: auto;
    margin-right: auto;
  }

  .modal-content {
    min-height: 580px;
  }
`;

const ModalContent = styled(Modal.Body)`
  display: flex;
  flex-direction: column;
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
  z-index: 1;
`;

interface AirdropModalProps {
  show: boolean;
  onClose: () => void;
}

const AirdropModal: React.FC<AirdropModalProps> = ({ show, onClose }) => {
  const [steps] = useState<"info">("info");

  const content = useMemo(() => {
    switch (steps) {
      case "info":
        return <AirdropInfo />;
    }
  }, [steps]);

  return (
    <StyledModal show={show} onHide={onClose} centered backdrop={true}>
      <BaseModalHeader>
        {" "}
        <CloseButton role="button" onClick={onClose}>
          <MenuButton
            isOpen={true}
            onToggle={onClose}
            size={20}
            color={"#FFFFFFA3"}
          />
        </CloseButton>
      </BaseModalHeader>
      <ModalContent>{content}</ModalContent>
    </StyledModal>
  );
};

export default AirdropModal;
