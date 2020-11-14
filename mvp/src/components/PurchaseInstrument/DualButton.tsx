import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { TwinYieldFactory } from "../../codegen";
import { BPoolFactory } from "../../codegen/BPoolFactory";
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

type DualButtonProps = {
  instrument: Instrument;
  purchaseAmount: number;
};

type Step = { onClick: () => void; buttonText: string };

const DualButton: React.FC<DualButtonProps> = ({
  instrument,
  purchaseAmount,
}) => {
  const { library } = useWeb3React();
  const [errorMessage, setErrorMessage] = useState("");
  const [purchaseTxhash, setPurchaseTxhash] = useState("");
  const [purchaseLoading, setPurchaseLoading] = useState(false);

  const instrumentContract = useMemo(() => {
    const signer = library.getSigner();
    return TwinYieldFactory.connect(instrument.instrumentAddress, signer);
  }, [library, instrument.instrumentAddress]);

  const balancerPool = useMemo(() => {
    const signer = library.getSigner();
    return BPoolFactory.connect(instrument.balancerPool, signer);
  }, [library, instrument.balancerPool]);

  const purchaseAmountEther = ethers.utils.parseEther(
    purchaseAmount ? purchaseAmount.toString() : "0"
  );

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

      const receipt = await instrumentContract.buyFromPool(
        purchaseAmountEther,
        minTokenOut,
        maxPrice,
        { value: purchaseAmountEther }
      );

      setErrorMessage("");
      setPurchaseTxhash(receipt.hash);

      await receipt.wait(1);

      setPurchaseLoading(false);
    } catch (e) {
      console.error(e);
      setErrorMessage("Purchase failed.");
      setPurchaseLoading(false);
    }
  }, [instrumentContract, balancerPool, instrument, purchaseAmountEther]);

  let steps: Step[] = [
    // {
    //   onClick: handleApprove,
    //   buttonText: approveLoading
    //     ? "Approving..."
    //     : `Approve WETH`,
    // },
    {
      onClick: handlePurchase,
      buttonText: purchaseLoading ? "Purchasing..." : `Purchase`,
    },
  ];

  return (
    <div>
      <ButtonsContainer>
        {steps.map((step, index) => (
          <MemoizedStepComponent
            key={index}
            active={Boolean(purchaseAmount)}
            onClick={purchaseAmount ? step.onClick : () => {}}
            buttonText={step.buttonText}
          ></MemoizedStepComponent>
        ))}
      </ButtonsContainer>
      <span>{errorMessage}</span>
      {purchaseTxhash && (
        <a
          target="_blank"
          rel="noreferrer"
          href={`https://kovan.etherscan.io/tx/${purchaseTxhash}`}
        >
          {purchaseTxhash.slice(0, 6) +
            "…" +
            purchaseTxhash.slice(purchaseTxhash.length - 4)}
        </a>
      )}
    </div>
  );
};

const StepComponent: React.FC<{
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  active: boolean;
  buttonText: string;
}> = ({ onClick, active, buttonText }) => {
  const Button = active ? ActiveButton : DisabledButton;
  const Text = active ? ButtonText : DisabledButtonText;
  // const Circle = active ? ActiveCircleStep : DisabledCircleStep;

  return (
    <ButtonContainer>
      <Button onClick={onClick}>
        <Text>{buttonText}</Text>
      </Button>
    </ButtonContainer>
  );
};

const MemoizedStepComponent = React.memo(StepComponent);

export default DualButton;
