import React from "react";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import { BigNumber, ethers } from "ethers";

import {
  BaseModal,
  BaseModalHeader,
  SecondaryText,
  Subtitle,
  Title,
} from "../../designSystem";
import { ActionParams, ACTIONS, ActionType } from "./types";
import { formatSignificantDecimals } from "../../utils/math";
import colors from "../../designSystem/colors";
import { ActionButton } from "../Common/buttons";

const { formatEther } = ethers.utils;

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

const AmountText = styled(Title)`
  font-size: 48px;
  line-height: 64px;
`;

const CurrencyText = styled(AmountText)`
  color: rgba(255, 255, 255, 0.48);
`;

const Arrow = styled.i`
  font-size: 12px;
  color: ${colors.primaryButton};
`;

const ActionModal: React.FC<{
  actionType: ActionType;
  show: boolean;
  onClose: () => void;
  amount: BigNumber;
  positionAmount: BigNumber;
  actionParams: ActionParams;
}> = ({ actionType, show, onClose, amount, positionAmount, actionParams }) => {
  const isDeposit = actionType === ACTIONS.deposit;
  const actionWord = isDeposit ? "Deposit" : "Withdrawal";

  let detailValue = "";

  switch (actionParams.action) {
    case ACTIONS.deposit:
      detailValue = actionParams.yield.toString();
      break;
    case ACTIONS.withdraw:
      detailValue = actionParams.withdrawalFee.toString();
      break;
    default:
      break;
  }

  const detailRows: { key: string; value: string }[] = [
    { key: "Product", value: "T-100-e" },
    { key: "Product Type", value: "Theta Vault" },
    isDeposit
      ? { key: "Approx. APY", value: `${detailValue}% APY` }
      : { key: "Withdrawal Fee", value: `${detailValue}%` },
  ];

  const originalAmount = formatSignificantDecimals(formatEther(positionAmount));
  const newAmount = formatSignificantDecimals(
    formatEther(
      isDeposit ? positionAmount.add(amount) : positionAmount.sub(amount)
    )
  );

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

      <Modal.Body className="d-flex flex-column align-items-center">
        <Subtitle className="d-block text-uppercase" style={{ opacity: 0.4 }}>
          {actionWord} Amount
        </Subtitle>

        <div>
          <AmountText>
            {formatSignificantDecimals(formatEther(amount), 4)}
          </AmountText>
          <CurrencyText> ETH</CurrencyText>
        </div>

        <div className="w-100 mt-4 px-3">
          {detailRows.map((detail) => (
            <div className="d-flex flex-row justify-content-between mb-4">
              <SecondaryText>{detail.key}</SecondaryText>
              <Title className="text-right">{detail.value}</Title>
            </div>
          ))}
          <div className="d-flex flex-row justify-content-between mb-4">
            <SecondaryText>Your Position</SecondaryText>
            <Title className="d-flex align-items-center text-right">
              {originalAmount} ETH{" "}
              <Arrow className="fas fa-arrow-right mx-2"></Arrow> {newAmount}{" "}
              ETH
            </Title>
          </div>
        </div>

        <ActionButton type="button" className="btn py-3 my-3">
          {isDeposit ? "Deposit" : "Withdraw"} Now
        </ActionButton>
      </Modal.Body>
    </BaseModal>
  );
};

export default ActionModal;
