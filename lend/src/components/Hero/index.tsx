import React from "react";
import styled from "styled-components";
import StepsHeader from "../StepsHeader";
import Footer from "../Footer";
import HeroContent from "../HeroContent";
import MobileHeader from "../MobileHeader";
import sizes from "../../designSystem/sizes";

const HeroContainer = styled.div`
  display: flex;
  width: calc(100% - 64px);
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  @media (max-width: ${sizes.lg}px) {
    width: 100%;
  }
`;

const Hero: React.FC = () => {
  return (
    <HeroContainer>
      <MobileHeader />
      <StepsHeader />
      <HeroContent />
      <Footer />
    </HeroContainer>
  );
};

export default Hero;
