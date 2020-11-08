import React from "react";
import styled from "styled-components";
import AccountStatus from "./AccountStatus";
import CurrentPrice from "./CurrentPrice";

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

const Header = () => {
  return (
    <header>
      <HeaderContainer>
        <HeaderLeft>
          <CurrentPrice></CurrentPrice>
        </HeaderLeft>

        <HeaderRight>
          <AccountStatus></AccountStatus>
        </HeaderRight>
      </HeaderContainer>
    </header>
  );
};

export default Header;
