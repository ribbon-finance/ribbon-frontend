import React from "react";
import styled from "styled-components";
import images from "../../img/currencyIcons";
import { BaseText } from "../../designSystem";
import AccountStatus from "./AccountStatus";

const { ETH: ETHIcon } = images;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 5em;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  margin-left: 16px;
`;

const HeaderRight = styled.div``;

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

const Header = () => {
  return (
    <header>
      <HeaderContainer>
        <HeaderLeft>
          <CurrencyIcon src={ETHIcon} alt="ETH"></CurrencyIcon>
          <ETHPriceContainer>
            <ETHPrice>$399.20</ETHPrice>
          </ETHPriceContainer>
        </HeaderLeft>

        <HeaderRight>
          <AccountStatus></AccountStatus>
        </HeaderRight>
      </HeaderContainer>
    </header>
  );
};

export default Header;
