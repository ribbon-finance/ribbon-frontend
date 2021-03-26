import React from "react";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import { BigNumber } from "ethers";

import { BaseModal, BaseModalHeader, Title } from "../../designSystem";
import { ActionParams, ACTIONS, ActionType } from "./types";

import useVault from "../../hooks/useVault";
import PreviewStep from "./PreviewStep";

const ActionModalHeader = styled(BaseModalHeader)`
  background: #151413;
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
  amount: BigNumber;
  positionAmount: BigNumber;
  actionParams: ActionParams;
}> = ({ actionType, show, onClose, amount, positionAmount, actionParams }) => {
  const actionWord = actionType === ACTIONS.deposit ? "Deposit" : "Withdrawal";

  const vault = useVault();

  const handleClickActionButton = async () => {
    if (vault !== null) {
      await vault.depositETH({ value: amount });
    }
  };

  return (
    <BaseModal show={show} onHide={onClose} centered>
      <ActionModalHeader closeButton={false}>
        <ModalTitle>{actionWord} Preview</ModalTitle>

        <CloseButton
          onClick={onClose}
          className="fas fa-times align-self-center text-white"
        ></CloseButton>
      </ActionModalHeader>

      <Modal.Body className="d-flex flex-column align-items-center">
        <PreviewStep
          actionType={actionType}
          amount={amount}
          positionAmount={positionAmount}
          actionParams={actionParams}
          onClickActionButton={handleClickActionButton}
        ></PreviewStep>
      </Modal.Body>
    </BaseModal>
  );
};

export default ActionModal;
