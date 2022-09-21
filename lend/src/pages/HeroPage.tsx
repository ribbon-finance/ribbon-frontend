import React from "react";
import styled from "styled-components";
import StepsHeader from "../components/StepsHeader";
import Footer from "../components/Footer";
import HeroContent from "../components/HeroContent";
import MobileHeader from "../components/MobileHeader";
import sizes from "../designSystem/sizes";

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

const HeroPage: React.FC = () => {
  return (
    <HeroContainer>
      <MobileHeader />
      <StepsHeader />
      <HeroContent word="ribbon lend" />
      <Footer />
    </HeroContainer>
  );
};

export default HeroPage;
