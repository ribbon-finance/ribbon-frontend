import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Ribbon from "../../img/RibbonLogo.svg";

const LogoContainer = styled.div``;

const Logo = () => {
  return (
    <LogoContainer>
      <Link to="/">
        <img
          src={Ribbon}
          alt="Ribbon Finance"
          style={{ height: 48, width: 48 }}
        ></img>
      </Link>
    </LogoContainer>
  );
};

export default Logo;
