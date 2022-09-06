import { Link } from "react-router-dom";
import styled from "styled-components";

import { default as AppLogo } from "shared/lib/assets/icons/logo";

const LogoContainer = styled.div`
  display: flex;
  border-radius: 48px;
`;

const Logo = () => {
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

export default Logo;
