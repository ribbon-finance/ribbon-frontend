import styled from "styled-components";

import { AppLogo } from "shared/lib/assets/icons/logo";

const LogoContainer = styled.div`
  display: flex;
  border-radius: 48px;
`;

const Logo = () => {
  return (
    <>
      <LogoContainer>
          <AppLogo height="48px" width="48px" />
      </LogoContainer>
    </>
  );
};

export default Logo;