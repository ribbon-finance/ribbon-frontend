import React, { useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import styled from "styled-components";

import { BaseModal, BaseModalHeader } from "shared/lib/designSystem";

import AirdropInfo from "./AirdropInfo";

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
      <BaseModalHeader closeButton></BaseModalHeader>
      <ModalContent>{content}</ModalContent>
    </StyledModal>
  );
};

export default AirdropModal;
