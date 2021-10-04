import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { AppLogo } from "shared/lib/assets/icons/logo";

const LogoContainer = styled.div`
  display: flex;
  border-radius: 48px;
`;

const HeaderLogo = () => {
  return (
    <>
      <LogoContainer>
        <Link to="/">
          <AppLogo height="48px" width="48px" />
        </Link>
      </LogoContainer>
    </>
  );
};

export default HeaderLogo;
