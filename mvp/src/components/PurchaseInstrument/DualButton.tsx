import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import React, { useCallback } from "react";
import styled from "styled-components";
import { IERC20Factory } from "../../codegen/IERC20Factory";
import { Button, SecondaryText } from "../../designSystem";
import { Instrument } from "../../models";

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
  instrument: Instrument;
  paymentCurrencySymbol: string;
};

const DualButton: React.FC<DualButtonProps> = ({
  instrument,
  paymentCurrencySymbol,
}) => {
  const { library } = useWeb3React();

  const handleApprove = useCallback(async () => {
    const signer = library.getSigner();
    const paymentERC20 = IERC20Factory.connect(
      instrument.paymentCurrencyAddress,
      signer
    );
    const MAX_UINT256 = ethers.BigNumber.from("2").pow("256").sub("1");

    await paymentERC20.approve(instrument.balancerPool, MAX_UINT256);
  }, [library, instrument.paymentCurrencyAddress, instrument.balancerPool]);

  return (
    <ButtonsContainer>
      <ButtonContainer>
        <ApproveButton onClick={handleApprove}>
          <ButtonText>Approve {paymentCurrencySymbol}</ButtonText>
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
