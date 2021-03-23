import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import useEagerConnect from "../hooks/useEagerConnect";

import Header from "./Header";
import Homepage from "./Homepage";

const RootApp = () => {
  useEagerConnect();

  return (
    <Router>
      <div>
        <Header />
        <Switch>
          <Route path="/" exact>
            <Homepage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default RootApp;
