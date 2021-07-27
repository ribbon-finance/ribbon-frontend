import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import styled from "styled-components";

import useScreenSize from "shared/lib/hooks/useScreenSize";
import useEagerConnect from "shared/lib/hooks/useEagerConnect";
import WalletConnectModal from "shared/lib/components/Wallet/WalletConnectModal";
import Header from "./Header/Header";
import Homepage from "../pages/Homepage/Homepage";
import Footer from "./Footer/Footer";
import TokenSwapModal from "./TokenSwap/TokenSwapModal";

const Root = styled.div<{ screenHeight: number }>`
  background-color: #1c1a19;
  min-height: ${(props) =>
    props.screenHeight ? `${props.screenHeight}px` : `100vh`};
`;

const RootApp = () => {
  useEagerConnect();
  const { height: screenHeight } = useScreenSize();

  return (
    <Root id="appRoot" screenHeight={screenHeight}>
      <WalletConnectModal />
      <TokenSwapModal />
      <Router>
        <Header />

        <Switch>
          <Route path="/" exact>
            <Homepage />
          </Route>
        </Switch>
        <Footer />
      </Router>
    </Root>
  );
};

export default RootApp;
