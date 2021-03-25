import React from "react";
import { Modal } from "react-bootstrap";

import { BaseModal, BaseModalHeader, Title } from "../../designSystem";
import { ActionType } from "./types";

const ActionModal: React.FC<{
  actionType: ActionType;
  show: boolean;
  onClose: () => void;
}> = ({ show, onClose }) => {
  return (
    <BaseModal show={show} onHide={onClose} centered>
      <BaseModalHeader closeButton>
        <Title>CONNECT WALLET</Title>
      </BaseModalHeader>
      <Modal.Body></Modal.Body>
    </BaseModal>
  );
};

export default ActionModal;
