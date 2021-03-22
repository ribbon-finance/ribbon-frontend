import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import Header from "./Header";

const RootApp = () => {
  return (
    <Router>
      <div>
        <Header />
      </div>
    </Router>
  );
};

export default RootApp;
