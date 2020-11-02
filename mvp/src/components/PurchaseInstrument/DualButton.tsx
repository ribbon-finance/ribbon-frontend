import React from "react";
import styled from "styled-components";
import { Button, SecondaryText } from "../../designSystem";

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  margin-bottom: 23px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 46%;
`;

const ActionButton = styled(Button)`
  width: 100%;
  border-radius: 10px;
  padding: 15px 15px;
  border: none;
  margin-bottom: 16px;
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

const CircleStep = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 10px;
  line-height: 12px;
  color: white;
  font-weight: bold;
`;

const ActiveCircleStep = styled(CircleStep)`
  background: #2d9cdb;
`;

const DisabledCircleStep = styled(CircleStep)`
  background: #c4c4c4;
`;

type DualButtonProps = {
  paymentCurrency: string;
};

const DualButton: React.FC<DualButtonProps> = ({ paymentCurrency }) => {
  return (
    <ButtonsContainer>
      <ButtonContainer>
        <ApproveButton>
          <ButtonText>Approve {paymentCurrency}</ButtonText>
        </ApproveButton>
        <ActiveCircleStep>1</ActiveCircleStep>
      </ButtonContainer>

      <ButtonContainer>
        <PurchaseButton>
          <DisabledButtonText>Purchase</DisabledButtonText>
        </PurchaseButton>
        <DisabledCircleStep>2</DisabledCircleStep>
      </ButtonContainer>
    </ButtonsContainer>
  );
};

export default DualButton;
