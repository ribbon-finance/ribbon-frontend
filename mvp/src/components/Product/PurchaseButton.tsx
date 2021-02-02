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
  font-family: Montserrat;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0px;
  text-align: center;
`;

type Props = {
  onClick: () => void;
  purchaseAmount: number;
};

type EnableButtonProps = {
  onClick: () => void;
  purchaseAmount: number;
};

const EnableButton: React.FC<EnableButtonProps> = ({
  onClick,
  purchaseAmount,
}) => {
  if (purchaseAmount === 0) {
    return (
      <StyledButton size="large" type="primary" onClick={onClick} disabled>
        <ButtonText>Preview Buy</ButtonText>
      </StyledButton>
    );
  } else {
    return (
      <StyledButton size="large" type="primary" onClick={onClick}>
        <ButtonText>Preview Buy</ButtonText>
      </StyledButton>
    );
  }
};

const PurchaseButton: React.FC<Props> = ({ onClick, purchaseAmount }) => {
  return (
    <div style={{ paddingTop: "30px" }}>
      <EnableButton
        onClick={onClick}
        purchaseAmount={purchaseAmount}
      ></EnableButton>
    </div>
  );
};

export default PurchaseButton;
