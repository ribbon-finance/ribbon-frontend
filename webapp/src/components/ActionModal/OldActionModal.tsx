import React, { ReactNode, useState } from "react";
import { Modal } from "react-bootstrap";
import styled from "styled-components";

import { BaseModal, BaseModalHeader, Title } from "../../designSystem";
import { ActionModalContent, StepData } from "./types";

const ActionModalHeader = styled(BaseModalHeader)`
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background: #151413;
  justify-content: center;
`;

const ModalTitle = styled(Title)`
  flex: 1;
  text-align: center;
`;

const ModalBody = styled(Modal.Body)`
  min-height: 450px;
  max-height: 450px;
`;

const CloseButton = styled.i`
  flex: 0;
  cursor: pointer;
  paddingright: 20px;
`;

interface ActionModalProps {
  show: boolean;
  onClose: () => void;
  ModalContent: ActionModalContent;
}

const ActionModal: React.FC<ActionModalProps> = ({
  show,
  onClose,
  ModalContent,
}) => {
  const [title, setTitle] = useState("");

  const onChangeStep = (step: StepData) => {
    setTitle(step.title);
  };

  return (
    <BaseModal
      show={show}
      onHide={onClose}
      centered
      backdropClassName="action-modal-backdrop"
    >
      <ActionModalHeader closeButton={false}>
        <ModalTitle>{title}</ModalTitle>

        <CloseButton
          onClick={onClose}
          className="fas fa-times align-self-center text-white"
        ></CloseButton>
      </ActionModalHeader>

      <ModalBody className="d-flex flex-column align-items-center justify-items-center">
        {<ModalContent onChangeStep={onChangeStep}></ModalContent>}
      </ModalBody>
    </BaseModal>
  );
};

export default ActionModal;
