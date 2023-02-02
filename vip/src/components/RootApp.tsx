import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import styled from "styled-components";

import Header from "./Header/Header";
import Homepage from "../pages/Home/Homepage";
import DepositPage from "../pages/DepositPage/DepositPage";
import useEagerConnect from "shared/lib/hooks/useEagerConnect";
import PortfolioPage from "../pages/Portfolio/PortfolioPage";
import Footer from "./Footer/Footer";
import useScreenSize from "shared/lib/hooks/useScreenSize";
import {
  TxStatusToast,
  WithdrawReminderToast,
} from "webapp/lib/components/Common/toasts";
import WalletConnectModal from "shared/lib/components/Wallet/WalletConnectModal";
import NotFound from "shared/lib/pages/NotFound";
import UserPage from "../pages/User/UserPage";
const Root = styled.div<{ screenHeight: number }>`
  max-height: 100vh;
  background: transparent;
`;

const RootApp = () => {
  useEagerConnect();
  const { height: screenHeight } = useScreenSize();
  return (
    <Root id="appRoot" screenHeight={screenHeight}>
      <WalletConnectModal />
      <WithdrawReminderToast />
      <Router>
        <Header />
        <TxStatusToast />
        <Switch>
          <Route path="/" exact>
            <Homepage />
          </Route>
          <Route path="/vip" exact>
            <UserPage />
          </Route>
          <Route path="/vip/:vaultSymbol" exact>
            <DepositPage />
          </Route>
          <Route path="/portfolio">
            <PortfolioPage />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
        <Footer />
      </Router>
    </Root>
  );
};

export default RootApp;
