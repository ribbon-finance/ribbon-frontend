import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Header from "./Header/Header";
import Homepage from "./Homepage/Homepage";
import DepositPage from "../pages/DepositPage/DepositPage";
import useEagerConnect from "../hooks/useEagerConnect";

const RootApp = () => {
  useEagerConnect();

  return (
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
  );
};

export default RootApp;
