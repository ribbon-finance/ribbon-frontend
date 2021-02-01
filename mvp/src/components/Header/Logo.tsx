import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Ribbon from "../../img/RibbonLogo.png";

const LogoContainer = styled.div``;

const Logo = () => {
  return (
    <LogoContainer>
      <Link to="/">
        <img src={Ribbon} alt="" height="80"></img>
      </Link>
    </LogoContainer>
  );
};

export default Logo;
