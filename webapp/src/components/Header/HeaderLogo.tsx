import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import colors from "shared/lib/designSystem/colors";
import Ribbon from "../../assets/img/RibbonLogo.svg";

const LogoContainer = styled.div`
  display: flex;
  background: linear-gradient(
    96.84deg,
    ${colors.red}29 1.04%,
    ${colors.red}3D 98.99%
  );
  border-radius: 48px;
`;

const HeaderLogo = () => {
  return (
    <>
      <LogoContainer>
        <Link to="/">
          <img
            src={Ribbon}
            alt="Ribbon Finance"
            style={{ height: 48, width: 48 }}
          />
        </Link>
      </LogoContainer>
    </>
  );
};

export default HeaderLogo;
