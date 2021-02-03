import React, { StrictMode, useCallback, useEffect, useMemo } from "react";
import styled from "styled-components";
import { Row, Col } from "antd";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import {
  createWeb3ReactRoot,
  useWeb3React,
  Web3ReactProvider,
} from "@web3-react/core";
// import your favorite web3 convenience library here

import Header from "./Header";
import Portfolio from "./Portfolio";
import Product from "./Product";
import Content404 from "./Content404";
import HomePage from "./HomePage";
import { NetworkConnector } from "@web3-react/network-connector";
import { getDefaultLibrary, getInfuraLibrary } from "../utils/getLibrary";

const AppContainer = styled.div``;

const MainContent = styled.div`
  padding-top: 20px;
`;

function App() {
  const Web3ReactInjected = createWeb3ReactRoot("injected");

  return (
    <Web3ReactProvider getLibrary={getInfuraLibrary}>
      <Web3ReactInjected getLibrary={getDefaultLibrary}>
        <StrictMode>
          <AppRoot></AppRoot>
        </StrictMode>
      </Web3ReactInjected>
    </Web3ReactProvider>
  );
}

function AppRoot() {
  const { activate } = useWeb3React();

  const networkConnector = useMemo(() => {
    return new NetworkConnector({
      urls: { 1: process.env.REACT_APP_MAINNET_URI as string },
      defaultChainId: 1,
    });
  }, []);

  const handleConnectRoot = useCallback(async () => {
    await activate(networkConnector);
  }, [networkConnector, activate]);

  useEffect(() => {
    (async () => {
      await handleConnectRoot();
    })();
  }, [handleConnectRoot]);

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
