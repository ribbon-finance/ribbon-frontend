import React from "react";
import styled from "styled-components";
import { Button, SecondaryText } from "../../designSystem";

const ActionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
`;

const ActionButton = styled(Button)`
  border-radius: 10px;
  padding: 15px 15px;
  width: 45%;
  border: none;
`;

const ApproveButton = styled(ActionButton)`
  background: #2d9cdb;
`;

const PurchaseButton = styled(ActionButton)`
  background: #848484;
`;

const ButtonText = styled(SecondaryText)`
  font-weight: bold;
  font-size: 18px;
  line-height: 21px;
  text-align: center;
`;
const DisabledButtonText = styled(ButtonText)`
  color: #b8b8b8;
`;

type DualButtonProps = {
  paymentCurrency: string;
};

const DualButton: React.FC<DualButtonProps> = ({ paymentCurrency }) => {
  return (
    <ActionsContainer>
      <ApproveButton>
        <ButtonText>Approve {paymentCurrency}</ButtonText>
      </ApproveButton>
      <PurchaseButton>
        <DisabledButtonText>Purchase</DisabledButtonText>
      </PurchaseButton>
    </ActionsContainer>
  );
};

export default DualButton;
