import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import styled from "styled-components";

import useScreenSize from "shared/lib/hooks/useScreenSize";
import useEagerConnect from "shared/lib/hooks/useEagerConnect";
import WalletConnectModal from "shared/lib/components/Wallet/WalletConnectModal";
import Header from "./Header/Header";
import Homepage from "../pages/Homepage";
import Footer from "./Footer/Footer";
import colors from "shared/lib/designSystem/colors";
import ProfilePage from "../pages/ProfilePage";
import StakingFAB from "./FAB/StakingFab";
import StakingModal from "./Staking/StakingModal";

const Root = styled.div<{ screenHeight: number }>`
  background-color: ${colors.background.one};
  min-height: ${(props) =>
    props.screenHeight ? `${props.screenHeight}px` : `100vh`};
`;

const RootApp = () => {
  useEagerConnect();
  const { height: screenHeight } = useScreenSize();

  return (
    <Root id="appRoot" screenHeight={screenHeight}>
      <WalletConnectModal />
      <StakingModal />

      <Router>
        <Header />

        <Switch>
          <Route path="/" exact>
            <Homepage />
          </Route>
          <Route path="/profile" exact>
            <ProfilePage />
          </Route>
        </Switch>
        <Footer />
        <StakingFAB />
      </Router>
    </Root>
  );
};

export default RootApp;
