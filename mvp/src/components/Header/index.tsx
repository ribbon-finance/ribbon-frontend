import React from "react";
import styled from "styled-components";
import AccountStatus from "./AccountStatus";
import CurrentPrice from "./CurrentPrice";
import Logo from "./Logo";

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
  height: 5em;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;

const HeaderMiddle = styled.div``;

const HeaderRight = styled.div``;

const Header = () => {
  return (
    <header>
      <HeaderContainer>
        <HeaderLeft>
          <CurrentPrice></CurrentPrice>
        </HeaderLeft>

        <HeaderMiddle>
          <Logo></Logo>
        </HeaderMiddle>

        <HeaderRight>
          <AccountStatus></AccountStatus>
        </HeaderRight>
      </HeaderContainer>
    </header>
  );
};

export default Header;
