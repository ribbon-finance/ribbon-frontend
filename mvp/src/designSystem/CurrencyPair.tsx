import React from "react";
import styled from "styled-components";
import currencyIcons from "../img/currencyIcons";

const CurrencyPairContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 66px;
`;

const CurrencyIcon = styled.img`
  width: 66px;
  height: 66px;
`;

const CurrencyIconLeft = styled(CurrencyIcon)``;

const CurrencyIconRight = styled(CurrencyIcon)``;

type CurrencyPairProps = {
  targetCurrency: string;
  paymentCurrency: string;
};

const CurrencyPair: React.FC<CurrencyPairProps> = ({
  targetCurrency,
  paymentCurrency
}) => {
  return (
    <CurrencyPairContainer>
      <CurrencyIconLeft
        src={currencyIcons[targetCurrency]}
        alt={targetCurrency}
      ></CurrencyIconLeft>
      <CurrencyIconRight
        src={currencyIcons[paymentCurrency]}
        alt={paymentCurrency}
      ></CurrencyIconRight>
    </CurrencyPairContainer>
  );
};

export default CurrencyPair;
