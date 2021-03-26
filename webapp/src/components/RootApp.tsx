import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import styled from "styled-components";

import Header from "./Header/Header";
import Homepage from "../pages/Home/Homepage";
import DepositPage from "../pages/DepositPage/DepositPage";
import useEagerConnect from "../hooks/useEagerConnect";

const Root = styled.div`
  position: fixed;
  overflow: auto;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: #1c1a19;
  -webkit-backdrop-filter: blur(3px);
  backdrop-filter: blur(3px);
`;

const RootApp = () => {
  useEagerConnect();

  return (
    <Root id="appRoot">
      <Router>
        <Header />
        <Switch>
          <Route path="/" exact>
            <Homepage />
          </Route>
          <Route path="/theta/deposit">
            <DepositPage></DepositPage>
          </Route>
        </Switch>
      </Router>
    </Root>
  );
};

export default RootApp;
