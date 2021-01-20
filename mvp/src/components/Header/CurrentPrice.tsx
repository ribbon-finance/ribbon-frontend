import React from "react";
import styled from "styled-components";
import images from "../../img/currencyIcons";
import { BaseText } from "../../designSystem";
import { useETHPriceInUSD } from "../../hooks/useEthPrice";

const { ETH: ETHIcon } = images;

const ETHPriceContainer = styled.div`
  margin-left: 8px;
`;

const ETHPrice = styled(BaseText)`
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
`;

const CurrencyIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-left: 8px;
`;

const CurrentPrice = () => {
  return (
    <>
      <CurrencyIcon src={ETHIcon} alt="ETH"></CurrencyIcon>
      <ETHPriceContainer>
        <ETHPrice>${useETHPriceInUSD().toFixed(2)}</ETHPrice>
      </ETHPriceContainer>
    </>
  );
};

export default CurrentPrice;
