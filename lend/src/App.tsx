import React from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LendVerticalHeader from "./components/Common/LendVerticalHeader";
import MobileHeader from "./components/MobileHeader";
import Hero from "./components/Hero";
import colors from "shared/lib/designSystem/colors";
import NotFound from "./pages/NotFound";
import MainPage from "./components/MainPage";
import "shared/lib/i18n/config";

const Body = styled.div`
  background-color: ${colors.background.one};
  display: flex;
  width: 100vw;
  height: 100vh;
`;

const HeroContainer = styled.div`
  display: flex;
  width: calc(100% - 64px);
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
`;

function App() {
  return (
    <Body>
      <Router>
        <LendVerticalHeader />
        <Switch>
          <Route path="/" exact>
            <Hero />
          </Route>
          <Route path="/app" exact>
            <MainPage />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </Router>
    </Body>
  );
}

export default App;
