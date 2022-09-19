import styled from "styled-components";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LendVerticalHeader from "../components/Common/LendVerticalHeader";
import Hero from "./HeroPage";
import LendPage from "./LendPage";
import NotFound from "./NotFound";
import useEagerConnect from "shared/lib/hooks/useEagerConnect";
import colors from "shared/lib/designSystem/colors";
import { TxStatusToast } from "../components/Common/toasts";
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
        <TxStatusToast />
        <LendVerticalHeader />
        <Switch>
          <Route path="/" exact>
            <Hero />
          </Route>
          <Route path="/app" exact>
            <LendPage />
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
