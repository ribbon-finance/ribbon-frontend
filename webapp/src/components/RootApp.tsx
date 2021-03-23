import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import useEagerConnect from "../hooks/useEagerConnect";

import Header from "./Header";

const RootApp = () => {
  useEagerConnect();

  return (
    <Router>
      <div>
        <Header />
      </div>
    </Router>
  );
};

export default RootApp;
