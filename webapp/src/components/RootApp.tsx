import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import styled from "styled-components";

import Header from "./Header/Header";
import Homepage from "../pages/Home/Homepage";
import DepositPage from "../pages/DepositPage/DepositPage";
import useEagerConnect from "../hooks/useEagerConnect";
import PortfolioPage from "../pages/Portfolio/PortfolioPage";
import Footer from "./Footer/Footer";
import useScreenSize from "../hooks/useScreenSize";
import PolicyPage from "../pages/PolicyPage";
import { WrongNetworkToast, TxStatusToast } from "./Common/toasts";

const Root = styled.div<{ screenHeight: number }>`
  background-color: #1c1a19;
  min-height: ${(props) =>
    props.screenHeight ? `${props.screenHeight}px` : `100vh`};
`;

const RootApp = () => {
  useEagerConnect();
  const { height: screenHeight } = useScreenSize();

  return (
    <Root id="appRoot" screenHeight={screenHeight}>
      <WrongNetworkToast></WrongNetworkToast>
      <TxStatusToast></TxStatusToast>
      <Router>
        <Header />
        <Switch>
          <Route path="/" exact>
            <Homepage />
          </Route>
          <Route path="/theta-vault">
            <DepositPage />
          </Route>
          <Route path="/portfolio">
            <PortfolioPage />
          </Route>
          <Route path="/policy">
            <PolicyPage />
          </Route>
        </Switch>
        <Footer />
      </Router>
    </Root>
  );
};

export default RootApp;
