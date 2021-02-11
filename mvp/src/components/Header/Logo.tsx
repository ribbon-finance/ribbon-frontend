import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { PrimaryMedium } from "../../designSystem";
import Ribbon from "../../img/RibbonLogo.svg";

const LogoContainer = styled.div``;

const LogoName = styled(PrimaryMedium)`
  font-family: "Montserrat", sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  margin-left: 8px;
  letter-spacing: 1.5px;
`;

const Logo = () => {
  return (
    <>
      <LogoContainer>
        <Link to="/">
          <img
            src={Ribbon}
            alt="Ribbon Finance"
            style={{ height: 48, width: 48 }}
          ></img>
        </Link>
      </LogoContainer>
      <LogoName>RIBBON</LogoName>
    </>
  );
};

export default Logo;
