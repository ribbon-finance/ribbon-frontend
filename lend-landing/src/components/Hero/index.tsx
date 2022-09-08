import React from "react";
import styled from "styled-components";
import HorizontalHeader from "../HorizontalHeader";
import Footer from "../Footer";
import HeroContent from "../HeroContent";

const HeroContainer = styled.div`
  display: flex;
  width: calc(100% - 64px);
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const Hero: React.FC = () => {
  return (
    <HeroContainer>
      <HorizontalHeader />
      <HeroContent />
      <Footer />
    </HeroContainer>
  );
};

export default Hero;
