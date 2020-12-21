import React from "react";
import styled from "styled-components";
import Icon from "../../img/Logo.png";

const LogoContainer = styled.div``;

const Logo = () => {
  return (
    <LogoContainer>
      <img src={Icon}></img>
    </LogoContainer>
  );
};

export default Logo;
