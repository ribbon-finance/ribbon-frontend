import React from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Web3ReactProvider } from "@web3-react/core";
// import your favorite web3 convenience library here

import Header from "./Header";
import ProductListing from "./ProductListing";
import PurchaseInstrument from "./PurchaseInstrument";
import { products } from "../mockData";
import Content404 from "./Content404";
import getLibrary from "../utils/getLibrary";

const AppContainer = styled.div`
  padding: 23px 30px;
`;

const MainContent = styled.div``;

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Router>
        <AppContainer className="App">
          <Header />
          <MainContent>
            <Switch>
              <Route exact path="/">
                <ProductListing product={products[0]}></ProductListing>
              </Route>
              <Route exact path="/instrument/:instrumentSymbol">
                <PurchaseInstrument></PurchaseInstrument>
              </Route>
              <Route path="*">
                <Content404></Content404>
              </Route>
            </Switch>
          </MainContent>
        </AppContainer>
      </Router>
    </Web3ReactProvider>
  );
}

export default App;
