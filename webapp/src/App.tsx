import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React from "react";
import Header from "./components/Header";
import DepositPage from "./pages/DepositPage/DepositPage";

function App() {
  return (
    <Router>
      <div>
        <Header />
      </div>
      <Switch>
        <Route path="/theta/deposit">
          <DepositPage></DepositPage>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
