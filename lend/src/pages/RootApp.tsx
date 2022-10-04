import styled from "styled-components";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LendVerticalHeader from "../components/Common/LendVerticalHeader";
import HeroPage from "./HeroPage";
import LendPage from "./LendPage";
import NotFound from "./NotFound";
import useEagerConnect from "shared/lib/hooks/useEagerConnect";
import colors from "shared/lib/designSystem/colors";
import { TxStatusToast } from "../components/Common/toasts";
import PoolPage from "./PoolPage";

const Body = styled.div`
  background-color: ${colors.background.one};
  display: flex;
  height: 100vh;
  height: -webkit-fill-available;
  overflow: hidden;
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
            <HeroPage />
          </Route>
          <Route path="/app" exact>
            <LendPage />
          </Route>
          <Route path="/app/pool/:poolId" exact>
            <PoolPage />
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
