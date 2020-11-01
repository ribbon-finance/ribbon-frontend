import React from "react";
import images from "../img/currencyIcons";
import ethereumAccountImage from "../img/ethAccount.svg";
import styled from "styled-components";

const { ETH } = images;

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
`;

const HeaderRight = styled.div``;

const CurrencyIcon = styled.img`
  width: 24px;
  height: 24px;
`;

const AccountPill = styled.div`
  display: flex;
  flex-direction: row;
  border-radius: 2px;
`;

const Header = () => {
  return (
    <header>
      <HeaderContainer>
        <HeaderLeft>
          <CurrencyIcon src={ETH} alt="ETH"></CurrencyIcon>
          <div>$399.20</div>
        </HeaderLeft>

        <HeaderRight>
          <AccountPill>
            <div>0.5083 ETH</div>
            <div>0x573B...c65F</div>
            <img src={ethereumAccountImage} alt="Account" />
          </AccountPill>
        </HeaderRight>
      </HeaderContainer>
    </header>
  );
};

export default Header;
