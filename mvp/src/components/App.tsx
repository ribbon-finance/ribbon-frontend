import React, { StrictMode } from "react";
import styled from "styled-components";
import { Row, Col } from "antd";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { createWeb3ReactRoot, Web3ReactProvider } from "@web3-react/core";
// import your favorite web3 convenience library here

import Header from "./Header";
import Portfolio from "./Portfolio";
import Product from "./Product";
import Content404 from "./Content404";
import getLibrary from "../utils/getLibrary";
import HomePage from "./HomePage";

const AppContainer = styled.div``;

const MainContent = styled.div`
  padding-top: 20px;
`;

function App() {
  const Web3ReactInjected = createWeb3ReactRoot("injected");

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ReactInjected getLibrary={getLibrary}>
        <StrictMode>
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
        </StrictMode>
      </Web3ReactInjected>
    </Web3ReactProvider>
  );
}

export default App;
