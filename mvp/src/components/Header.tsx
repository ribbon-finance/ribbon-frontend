import React from "react";
import styled from "styled-components";
import images from "../img/currencyIcons";
import ethereumAccountImage from "../img/ethAccount.svg";
import { BaseText, SecondaryText } from "../designSystem";

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

const AccountPill = styled.div`
  display: flex;
  flex-direction: row;
  background: #bcbcbc;
  border-radius: 10px;
`;

const AccountPillText = styled(SecondaryText)`
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
`;

const AccountPillBalance = styled.div`
  background: #bcbcbc;
  padding: 5px 7px;
  border-radius: 10px;
`;

const AccountPillAddress = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #636363;
  padding: 5px 7px;
  border-radius: 10px;
`;

const AddressIcon = styled.img`
  margin-left: 2px;
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
          <AccountPill>
            <AccountPillBalance>
              <AccountPillText>0.5083 ETH</AccountPillText>
            </AccountPillBalance>
            <AccountPillAddress>
              <AccountPillText>0x573B...c65F</AccountPillText>
              <AddressIcon src={ethereumAccountImage} alt="Account" />
            </AccountPillAddress>
          </AccountPill>
        </HeaderRight>
      </HeaderContainer>
    </header>
  );
};

export default Header;
