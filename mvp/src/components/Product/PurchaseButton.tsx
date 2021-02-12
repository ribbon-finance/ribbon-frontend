import React from "react";
import styled from "styled-components";
import { Button } from "antd";

const StyledButton = styled(Button)`
  background-color: black;
  height: 100%;
  width: 100%;
  border-radius: 8px;
  padding-top: 12px;
  padding-bottom: 12px;
`;

const ButtonText = styled.span`
  font-family: "Inter", sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0px;
  text-align: center;
`;

type Props = {
  onClick: () => void;
  purchaseAmount: number;
};

const PurchaseButton: React.FC<Props> = ({ onClick, purchaseAmount }) => {
  console.log(purchaseAmount, typeof purchaseAmount);
  return (
    <div style={{ paddingTop: "30px" }}>
      <StyledButton
        size="large"
        type="primary"
        onClick={onClick}
        disabled={purchaseAmount === 0}
      >
        <ButtonText>Preview Buy</ButtonText>
      </StyledButton>
    </div>
  );
};

export default PurchaseButton;
