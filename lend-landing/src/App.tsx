import React from "react";
import styled from "styled-components";
import { BrowserRouter as Router } from "react-router-dom";
import LendHeader from "shared/lib/components/Common/LendHeader";
import Hero from "./components/Hero";
import colors from "shared/lib/designSystem/colors";
import "shared/lib/i18n/config";

const Body = styled.div`
  background-color: ${colors.background.one};
  display: flex;
  width: 100vw;
  height: 100vh;
`;

function App() {
  return (
    <Body>
      <Router>
        <LendHeader />
        <Hero />
      </Router>
    </Body>
  );
}

export default App;
