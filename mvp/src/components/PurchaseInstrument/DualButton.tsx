import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import { BPoolFactory } from "../../codegen/BPoolFactory";
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

const MAX_UINT256 = ethers.BigNumber.from("2").pow("256").sub("1");

const DualButton: React.FC<DualButtonProps> = ({
  instrument,
  paymentCurrencySymbol,
}) => {
  const { library } = useWeb3React();

  const paymentERC20 = useMemo(() => {
    const signer = library.getSigner();
    return IERC20Factory.connect(instrument.paymentCurrencyAddress, signer);
  }, [library, instrument.paymentCurrencyAddress]);

  const balancerPool = useMemo(() => {
    const signer = library.getSigner();
    return BPoolFactory.connect(instrument.balancerPool, signer);
  }, [library, instrument.balancerPool]);

  const handleApprove = useCallback(async () => {
    await paymentERC20.approve(instrument.balancerPool, MAX_UINT256);
  }, [paymentERC20, instrument.balancerPool]);

  const handlePurchase = useCallback(async () => {
    // await balancerPool.swapExactAmountIn(
    // )
  }, []);

  return (
    <ButtonsContainer>
      <ButtonContainer>
        <ApproveButton onClick={handleApprove}>
          <ButtonText>Approve {paymentCurrencySymbol}</ButtonText>
        </ApproveButton>
        <ActiveCircleStep>1</ActiveCircleStep>
      </ButtonContainer>

      <ButtonContainer>
        <PurchaseButton onClick={handlePurchase}>
          <DisabledButtonText>Purchase</DisabledButtonText>
        </PurchaseButton>
        <DisabledCircleStep>2</DisabledCircleStep>
      </ButtonContainer>
    </ButtonsContainer>
  );
};

export default DualButton;
