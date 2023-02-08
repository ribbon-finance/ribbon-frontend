import React from "react";
import styled from "styled-components";

import { VIPLogo } from "shared/lib/assets/icons/logo";
import { Subtitle } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  background: ${colors.background.three};
  border-radius: 8px;
  width: 100%;
  height: 40px;
  padding-left: 4px;
  padding-right: 4px;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 8px;
`;

const ClaimText = styled(Subtitle)`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
  text-transform: uppercase;
  color: ${colors.primaryText};
  letter-spacing: 0.3px;
`;

const VIPButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <ButtonContainer role="button" onClick={onClick}>
      <LogoContainer>
        <VIPLogo height={24} width={24} />
      </LogoContainer>
      <ClaimText>Ribbon VIP</ClaimText>
    </ButtonContainer>
  );
};

export default VIPButton;
