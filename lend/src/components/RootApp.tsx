import styled from "styled-components";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LendVerticalHeader from "./Common/LendVerticalHeader";
import Hero from "./Hero";
import MainPage from "./MainPage";
import NotFound from "../pages/NotFound";
import useEagerConnect from "shared/lib/hooks/useEagerConnect";
import colors from "shared/lib/designSystem/colors";

const Body = styled.div`
  background-color: ${colors.background.one};
  display: flex;
  width: 100vw;
  height: 100vh;
`;

const RootApp = () => {
  useEagerConnect();

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
};

export default RootApp;
