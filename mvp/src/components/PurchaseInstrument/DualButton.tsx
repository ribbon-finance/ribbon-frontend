import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { BPoolFactory } from "../../codegen/BPoolFactory";
import { IERC20Factory } from "../../codegen/IERC20Factory";
import { Button, SecondaryText } from "../../designSystem";
import { Instrument } from "../../models";
import { canSwapTokens } from "../../utils/balancer";

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
  cursor: auto;
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
  const { library, account } = useWeb3React();
  const [currentStep, setCurrentStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [approveLoading, setApproveLoading] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);

  const paymentERC20 = useMemo(() => {
    const signer = library.getSigner();
    return IERC20Factory.connect(instrument.paymentCurrencyAddress, signer);
  }, [library, instrument.paymentCurrencyAddress]);

  const balancerPool = useMemo(() => {
    const signer = library.getSigner();
    return BPoolFactory.connect(instrument.balancerPool, signer);
  }, [library, instrument.balancerPool]);

  const purchaseAmountEther = ethers.utils.parseEther(
    purchaseAmount.toString()
  );

  useEffect(() => {
    if (library && account) {
      (async () => {
        const allowance = await paymentERC20.allowance(
          account,
          instrument.balancerPool
        );
        if (allowance.gt(purchaseAmountEther)) {
          setCurrentStep(1);
        }
      })();
    }
  }, [
    library,
    account,
    paymentERC20,
    instrument.balancerPool,
    purchaseAmountEther,
  ]);

  const handleApprove = useCallback(async () => {
    setApproveLoading(true);
    try {
      const receipt = await paymentERC20.approve(
        instrument.balancerPool,
        MAX_UINT256
      );
      const tx = await receipt.wait(1);
      setApproveLoading(false);
      setErrorMessage("");
      setCurrentStep(1);
      console.log(tx);
    } catch (e) {
      setErrorMessage("Approval failed.");
      setApproveLoading(false);
    }
  }, [paymentERC20, instrument.balancerPool]);

  const handlePurchase = useCallback(async () => {
    setPurchaseLoading(true);

    const res = await canSwapTokens(
      balancerPool,
      purchaseAmountEther,
      instrument
    );

    if (!res.success) {
      console.error(res.error);
      setErrorMessage(res.error.message);
      setPurchaseLoading(false);
      return;
    }

    const { minTokenOut, maxPrice } = res;
    try {
      console.log(
        `Purchasing ${ethers.utils.formatEther(
          purchaseAmountEther
        )}\nMin token out: ${ethers.utils.formatEther(
          minTokenOut
        )}\nMax price: ${ethers.utils.formatEther(maxPrice)}`
      );

      const receipt = await balancerPool.swapExactAmountIn(
        instrument.paymentCurrencyAddress,
        purchaseAmountEther,
        instrument.dTokenAddress,
        minTokenOut,
        maxPrice
      );

      await receipt.wait(1);
      setPurchaseLoading(false);
    } catch (e) {
      console.error(e);
      setErrorMessage("Purchase failed.");
      setPurchaseLoading(false);
    }
  }, [balancerPool, instrument, purchaseAmountEther]);

  let steps: Step[] = [
    {
      onClick: handleApprove,
      buttonText: approveLoading
        ? "Approving..."
        : `Approve ${paymentCurrencySymbol}`,
    },
    {
      onClick: handlePurchase,
      buttonText: purchaseLoading
        ? "Purchasing..."
        : `Purchase ${paymentCurrencySymbol}`,
    },
  ];

  return (
    <div>
      <ButtonsContainer>
        {steps.map((step, index) => (
          <MemoizedStepComponent
            key={index}
            active={Boolean(purchaseAmount) && index === currentStep}
            onClick={
              purchaseAmount && index === currentStep ? step.onClick : () => {}
            }
            stepNumber={index + 1}
            buttonText={step.buttonText}
          ></MemoizedStepComponent>
        ))}
      </ButtonsContainer>
      <span>{errorMessage}</span>
    </div>
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
