import React from "react";
import styled from "styled-components";

const HeroContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
`;

const MainPage: React.FC = () => {
  return <HeroContainer></HeroContainer>;
};

export default MainPage;
