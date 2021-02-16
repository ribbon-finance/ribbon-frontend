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
import useEagerConnect from "../hooks/useEagerConnect";
import useInactiveListener from "../hooks/useInactiveListener";
import Footer from "./Footer";
import Disclaimer from "./Disclaimer";
import { ETHPriceProvider } from "../hooks/useEthPrice";
import FAQPage from "./FAQ";

const AppContainer = styled.div``;

const MainContent = styled.div`
  padding-top: 20px;
`;

function App() {
  return (
    <Web3ContextProvider>
      <Web3ReactProvider getLibrary={getLibrary}>
        <StrictMode>
          <ETHPriceProvider>
            <AppRoot></AppRoot>
          </ETHPriceProvider>
        </StrictMode>
      </Web3ReactProvider>
    </Web3ContextProvider>
  );
}

function AppRoot() {
  useEagerConnect();
  useInactiveListener();

  return (
    <Router>
      <AppContainer className="App">
        <Disclaimer></Disclaimer>
        <Header />
        <MainContent>
          <Row justify="center" align="middle">
            <Col
              md={{ span: 18 }}
              lg={{ span: 18 }}
              xl={{ span: 18 }}
              xxl={{ span: 14 }}
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
                <Route exact path="/faq">
                  <FAQPage></FAQPage>
                </Route>
                <Route path="*">
                  <Content404></Content404>
                </Route>
              </Switch>
            </Col>
          </Row>
        </MainContent>
        <Footer></Footer>
      </AppContainer>
    </Router>
  );
}

export default App;
