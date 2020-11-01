import React from "react";
import images from "../img/currencyIcons";
import ethereumAccountImage from "../img/ethAccount.svg";
import styled from "styled-components";

const { ETH } = images;

const HeaderContainer = styled.div`
  flex: 1;
`;

const Header = () => {
  return (
    <header>
      <HeaderContainer>
        <img src={ETH} alt="ETH" />
        <div>$399.20</div>
        <div>0.5083 ETH</div>
        <div>0x573B...c65F</div>
        <img src={ethereumAccountImage} alt="Account" />
      </HeaderContainer>
    </header>
  );
};

export default Header;
