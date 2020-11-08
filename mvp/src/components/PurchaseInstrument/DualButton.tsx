import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import React, { ReactNode, useCallback, useMemo, useState } from "react";
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

const ActiveButton = styled(ActionButton)`
  background: #2d9cdb;
`;

const DisabledButton = styled(ActionButton)`
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
  purchaseAmount: number;
};

const MAX_UINT256 = ethers.BigNumber.from("2").pow("256").sub("1");

type Step = { onClick: () => void; buttonText: string };

const DualButton: React.FC<DualButtonProps> = ({
  instrument,
  paymentCurrencySymbol,
  purchaseAmount,
}) => {
  const { library } = useWeb3React();
  const [currentStep, setCurrentStep] = useState(0);

  const paymentERC20 = useMemo(() => {
    const signer = library.getSigner();
    return IERC20Factory.connect(instrument.paymentCurrencyAddress, signer);
  }, [library, instrument.paymentCurrencyAddress]);

  const balancerPool = useMemo(() => {
    const signer = library.getSigner();
    return BPoolFactory.connect(instrument.balancerPool, signer);
  }, [library, instrument.balancerPool]);

  const handleApprove = useCallback(async () => {
    const receipt = await paymentERC20.approve(
      instrument.balancerPool,
      MAX_UINT256
    );
  }, [paymentERC20, instrument.balancerPool]);

  const handlePurchase = useCallback(async () => {
    const purchaseAmountEther = ethers.utils.parseEther(
      purchaseAmount.toString()
    );
    const spotPlusFees = instrument.instrumentSpotPrice.mul(
      ethers.BigNumber.from("1").add(instrument.swapFee)
    );
    const maxSlippage = ethers.utils.parseEther("0.0001");
    const spotWithMaxSlippage = spotPlusFees.mul(maxSlippage);
    const minTokenOut = purchaseAmountEther.mul(spotWithMaxSlippage);

    await balancerPool.swapExactAmountIn(
      instrument.paymentCurrencyAddress,
      purchaseAmountEther,
      instrument.dTokenAddress,
      minTokenOut,
      spotWithMaxSlippage
    );
  }, [
    balancerPool,
    instrument.paymentCurrencyAddress,
    instrument.dTokenAddress,
    purchaseAmount,
    instrument.swapFee,
    instrument.instrumentSpotPrice,
  ]);

  const steps: Step[] = [
    {
      onClick: handleApprove,
      buttonText: `Approve ${paymentCurrencySymbol}`,
    },
    {
      onClick: handlePurchase,
      buttonText: `Purchase ${paymentCurrencySymbol}`,
    },
  ];

  return (
    <ButtonsContainer>
      {steps.map((step, index) => (
        <MemoizedStepComponent
          key={index}
          active={index === currentStep}
          onClick={index === currentStep ? step.onClick : () => {}}
          stepNumber={index + 1}
          buttonText={step.buttonText}
        ></MemoizedStepComponent>
      ))}
    </ButtonsContainer>
  );
};

const StepComponent: React.FC<{
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  active: boolean;
  stepNumber: number;
  buttonText: string;
}> = ({ onClick, active, buttonText, stepNumber }) => {
  const Button = active ? ActiveButton : DisabledButton;
  const Text = active ? ButtonText : DisabledButtonText;
  const Circle = active ? ActiveCircleStep : DisabledCircleStep;

  return (
    <ButtonContainer>
      <Button onClick={onClick}>
        <Text>{buttonText}</Text>
      </Button>
      <Circle>{stepNumber}</Circle>
    </ButtonContainer>
  );
};

const MemoizedStepComponent = React.memo(StepComponent);

export default DualButton;
