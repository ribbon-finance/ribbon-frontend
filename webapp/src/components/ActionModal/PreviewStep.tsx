import React from "react";
import styled from "styled-components";
import { BigNumber, ethers } from "ethers";

import { Subtitle, SecondaryText, Title } from "../../designSystem";
import colors from "../../designSystem/colors";
import { ActionButton } from "../Common/buttons";
import { ActionParams, ActionType, ACTIONS } from "./types";
import { formatSignificantDecimals } from "../../utils/math";
const { formatEther } = ethers.utils;

const AmountText = styled(Title)`
  font-size: 40px;
  line-height: 64px;
`;

const CurrencyText = styled(AmountText)`
  color: rgba(255, 255, 255, 0.48);
`;

const Arrow = styled.i`
  font-size: 12px;
  color: ${colors.primaryButton};
`;

interface PreviewStepProps {
  actionType: ActionType;
  amount: BigNumber;
  positionAmount: BigNumber;
  actionParams: ActionParams;
  onClickActionButton: () => Promise<void>;
}

const PreviewStep: React.FC<PreviewStepProps> = ({
  actionType,
  amount,
  positionAmount,
  actionParams,
  onClickActionButton,
}) => {
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
    <>
      <div
        style={{ flex: 1 }}
        className="d-flex w-100 flex-column align-items-center"
      >
        <Subtitle className="d-block text-uppercase" style={{ opacity: 0.4 }}>
          {actionWord} Amount
        </Subtitle>

        <div>
          <AmountText>
            {formatSignificantDecimals(formatEther(amount), 4)}
          </AmountText>
          <CurrencyText> ETH</CurrencyText>
        </div>

        <div className="w-100 mt-4">
          {detailRows.map((detail, index) => (
            <div
              key={index}
              className="d-flex flex-row justify-content-between mb-4"
            >
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
      </div>

      <ActionButton onClick={onClickActionButton} className="btn py-3 my-3">
        {isDeposit ? "Deposit" : "Withdraw"} Now
      </ActionButton>
    </>
  );
};

export default PreviewStep;
