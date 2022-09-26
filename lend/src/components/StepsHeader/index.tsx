import React from "react";
import styled from "styled-components";
import colors from "shared/lib/designSystem/colors";
import sizes from "../../designSystem/sizes";
import theme from "../../designSystem/theme";
import StepsCarousel from "./StepsCarousel";
const HeaderContainer = styled.div`
  display: flex;
  width: 100%;
  height: 64px;
  min-height: 64px;
  justify-content: center;
  align-items: top;
  z-index: 1001;
  border-bottom: 1px solid ${colors.border};
`;

const ButtonContainer = styled.div`
  display: flex;
  z-index: 0;
  margin-left: auto;
  background: rgba(22, 206, 185, 0.08);
  width: fit-content;
  height: 100%;
  justify-content: center;
  align-items: center;
  border-left: 1px solid ${colors.border};
  @media (max-width: ${sizes.lg}px) {
    display: none;
  }
`;

const ButtonText = styled.span`
  font-family: VCR;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 24px;
  text-align: center;
  text-transform: capitalize;
  color: ${colors.green};
  margin-left: auto;
  width: 100%;
`;

const OpenAppButton = styled.div`
  display: flex;
  width: 100%;
  height: 64px;
  padding-left: 40px;
  padding-right: 40px;
  justify-content: center;
  align-items: center;
  text-align: center;
  // uncomment on launch
  // &:hover {
  //   cursor: pointer;
  //   opacity: ${theme.hover.opacity};
  // }
`;

const StepsHeader: React.FC = () => {
  return (
    <HeaderContainer>
      <StepsCarousel />
      <ButtonContainer>
        {/* uncomment on launch */}
        <a href={"/app"}>
          <OpenAppButton>
            <ButtonText>OPEN APP</ButtonText>
          </OpenAppButton>
        </a>
      </ButtonContainer>
    </HeaderContainer>
  );
};

export default StepsHeader;
