import styled from "styled-components";

import Logo, { AppLogo as AppLogoBasic } from "shared/lib/assets/icons/logo";

const LogoContainer = styled.div`
  display: flex;
  border-radius: 48px;
`;

const RbnLogoContainer = styled.div`
  display: flex;
  border-radius: 80px;
`;

export const AppLogo = () => {
  return (
    <>
      <LogoContainer>
        <AppLogoBasic height="48px" width="48px" />
      </LogoContainer>
    </>
  );
};

export const RbnLogo = () => {
  return (
    <>
      <RbnLogoContainer>
        <Logo height="80px" width="80px" />
      </RbnLogoContainer>
    </>
  );
};
