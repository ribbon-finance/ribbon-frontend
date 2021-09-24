import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import styled from "styled-components";

import useScreenSize from "shared/lib/hooks/useScreenSize";
import useEagerConnect from "shared/lib/hooks/useEagerConnect";
import WalletConnectModal from "shared/lib/components/Wallet/WalletConnectModal";
import Header from "./Header/Header";
import Homepage from "../pages/Homepage/Homepage";
import Footer from "./Footer/Footer";
import InfoModal from "./Shared/InfoModal";
import colors from "shared/lib/designSystem/colors";
import ClaimModal from "./Claim/ClaimModal";

const Root = styled.div<{ screenHeight: number }>`
  background-color: ${colors.background};
  min-height: ${(props) =>
    props.screenHeight ? `${props.screenHeight}px` : `100vh`};
`;

const RootApp = () => {
  useEagerConnect();
  const { height: screenHeight } = useScreenSize();

  return (
    <Root id="appRoot" screenHeight={screenHeight}>
      <WalletConnectModal />
      <InfoModal />
      <ClaimModal />
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
