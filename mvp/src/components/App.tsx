import React from "react";
import styled from "styled-components";
import { Row, Col } from "antd";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Web3ReactProvider } from "@web3-react/core";
// import your favorite web3 convenience library here

import Header from "./Header";
import Dashboard from "./Dashboard";
import Banner from "./Banner";
import ProductListing from "./ProductListing";
import Product from "./Product";
import { products } from "../mockData";
import Content404 from "./Content404";
import getLibrary from "../utils/getLibrary";

const AppContainer = styled.div``;

const MainContent = styled.div`
  padding-top: 30px;
`;

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Router>
        <AppContainer className="App">
          <Header />
          <MainContent>
            <Row align="middle">
              <Col
                md={{ span: 18, offset: 3 }}
                lg={{ span: 18, offset: 3 }}
                xl={{ span: 18, offset: 3 }}
                xxl={{ span: 12, offset: 6 }}
              >
                <Switch>
                  <Route exact path="/">
                    {/* <Dashboard></Dashboard> */}
                    <Banner></Banner>
                    <ProductListing product={products[0]}></ProductListing>
                  </Route>
                  <Route exact path="/instrument/:instrumentSymbol">
                    <Product></Product>
                  </Route>
                  <Route path="*">
                    <Content404></Content404>
                  </Route>
                </Switch>
              </Col>
            </Row>
          </MainContent>
        </AppContainer>
      </Router>
    </Web3ReactProvider>
  );
}

export default App;
