import React from "react";
import styled from "styled-components";
import { Button } from "antd";

const ButtonStyled = styled(Button)`
  height: 100%;
  border-radius: 10px;
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
      <ButtonStyled type="primary" shape="round" onClick={onClick} disabled>
        <b>Buy Now</b>
      </ButtonStyled>
    );
  } else {
    return (
      <ButtonStyled type="primary" shape="round" onClick={onClick}>
        <b>Buy Now</b>
      </ButtonStyled>
    );
  }
};

const PurchaseButton: React.FC<Props> = ({ onClick, purchaseAmount }) => {
  return (
    <div>
      <EnableButton
        onClick={onClick}
        purchaseAmount={purchaseAmount}
      ></EnableButton>
    </div>
  );
};

export default PurchaseButton;
