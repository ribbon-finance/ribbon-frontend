import React from "react";
import styled from "styled-components";
import Icon from "../../img/Logo.png";

const LogoContainer = styled.div``;

const Logo = () => {
  return (
    <LogoContainer>
      <a href="/">
        <img src={Icon} alt=""></img>
      </a>
    </LogoContainer>
  );
};

export default Logo;
