import React from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { createWeb3ReactRoot } from "@web3-react/core";
// import your favorite web3 convenience library here

import Header from "./Header";
import ProductListing from "./ProductListing";
import PurchaseInstrument from "./PurchaseInstrument";
import { products } from "../mockData";
import Content404 from "./Content404";
import { getInfuraLibrary, getMetamaskLibrary } from "../utils/getLibrary";

const AppContainer = styled.div`
  padding: 23px 30px;
`;

const MainContent = styled.div``;

const InfuraWeb3Provider = createWeb3ReactRoot("infura");
const InjectedWeb3Provider = createWeb3ReactRoot("metamask");

function App() {
  return (
    // <InjectedWeb3Provider getLibrary={getMetamaskLibrary}>
    <InfuraWeb3Provider getLibrary={getInfuraLibrary}>
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
    </InfuraWeb3Provider>
    // </InjectedWeb3Provider>
  );
}

export default App;
