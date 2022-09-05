import React from "react";
import styled from "styled-components";

import Logo from "shared/lib/assets/icons/logo";
import { Subtitle } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  background: rgba(252, 10, 84, 0.12);
  border-radius: 48px;
  width: 100%;
  padding: 4px 4px;
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
  color: #fc0a54;
  letter-spacing: 0.3px;
`;

const RedLogo = styled(Logo)`
  circle {
    fill: ${colors.products.yield}3D;
  }

  path {
    stroke: ${colors.products.yield};
  }
`;

const AirdropButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <ButtonContainer role="button" onClick={onClick}>
      <LogoContainer>
        <RedLogo height={24} width={24} />
      </LogoContainer>
      <ClaimText>Claim Airdrop</ClaimText>
    </ButtonContainer>
  );
};

export default AirdropButton;
