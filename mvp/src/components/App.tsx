import React, { StrictMode } from "react";
import styled from "styled-components";
import { Row, Col } from "antd";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Web3ReactProvider } from "@web3-react/core";

import Header from "./Header";
import Portfolio from "./Portfolio";
import Product from "./Product";
import Content404 from "./Content404";
import HomePage from "./HomePage";
import { getLibrary } from "../utils/getLibrary";
import { Web3ContextProvider } from "../hooks/web3Context";

const AppContainer = styled.div``;

const MainContent = styled.div`
  padding-top: 20px;
`;

function App() {
  return (
    <Web3ContextProvider>
      <Web3ReactProvider getLibrary={getLibrary}>
        <StrictMode>
          <AppRoot></AppRoot>
        </StrictMode>
      </Web3ReactProvider>
    </Web3ContextProvider>
  );
}

function AppRoot() {
  return (
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
                <Route path="/" exact>
                  <HomePage></HomePage>
                </Route>
                <Route path="/product/:categoryID">
                  <HomePage></HomePage>
                </Route>
                <Route exact path="/instrument/:instrumentSymbol">
                  <Product></Product>
                </Route>
                <Route exact path="/portfolio">
                  <Portfolio></Portfolio>
                </Route>
                <Route path="*">
                  <Content404></Content404>
                </Route>
              </Switch>
            </Col>
            <Col span={3}></Col>
          </Row>
        </MainContent>
      </AppContainer>
    </Router>
  );
}

export default App;
