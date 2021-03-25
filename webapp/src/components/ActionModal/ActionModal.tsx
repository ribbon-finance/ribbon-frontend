import React from "react";
import { Modal } from "react-bootstrap";
import styled from "styled-components";

import { BaseModal, BaseModalHeader, Title } from "../../designSystem";
import { ACTIONS, ActionType } from "./types";

const ActionModalHeader = styled(BaseModalHeader)`
  justify-content: center;
`;

const ModalTitle = styled(Title)`
  flex: 1;
  text-align: center;
`;

const CloseButton = styled.i`
  flex: 0;
  paddingright: 20px;
`;

const ActionModal: React.FC<{
  actionType: ActionType;
  show: boolean;
  onClose: () => void;
}> = ({ actionType, show, onClose }) => {
  const actionWord = actionType === ACTIONS.deposit ? "Deposit" : "Withdrawal";

  return (
    <BaseModal show={show} onHide={onClose} centered>
      <ActionModalHeader closeButton={false}>
        <ModalTitle>{actionWord} Preview</ModalTitle>

        <CloseButton
          onClick={onClose}
          className="fas fa-times align-self-center text-white"
          style={{}}
        ></CloseButton>
      </ActionModalHeader>
      <Modal.Body></Modal.Body>
    </BaseModal>
  );
};

export default ActionModal;
