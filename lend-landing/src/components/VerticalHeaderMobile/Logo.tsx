import { Link } from "react-router-dom";
import styled from "styled-components";

import { AppLogo } from "shared/lib/assets/icons/logo";

const LogoContainer = styled.div`
  display: flex;
  border-radius: 24px;
`;

const Logo = () => {
  return (
    <>
      <LogoContainer>
        <Link to="/">
          <AppLogo height="24px" width="24px" />
        </Link>
      </LogoContainer>
    </>
  );
};

export default Logo;
