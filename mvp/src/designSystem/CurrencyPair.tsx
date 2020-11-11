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

const CurrencyIconLeft = styled(CurrencyIcon)`
  position: absolute;
  left: calc(50% - 58px);
`;

const CurrencyIconRight = styled(CurrencyIcon)`
  position: absolute;
  right: calc(50% - 58px);
`;

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
        src={currencyIcons['USD']}
        alt={paymentCurrency}
      ></CurrencyIconRight>
    </CurrencyPairContainer>
  );
};

export default CurrencyPair;
