import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useLocation } from "react-router";
import styled from "styled-components";

import Header from "./Header/Header";
import Homepage from "../pages/Home/Homepage";
import DepositPage from "../pages/DepositPage/DepositPage";
import useEagerConnect from "shared/lib/hooks/useEagerConnect";
import PortfolioPage from "../pages/Portfolio/PortfolioPage";
import Footer from "./Footer/Footer";
import useScreenSize from "shared/lib/hooks/useScreenSize";
import { TxStatusToast, WithdrawReminderToast } from "./Common/toasts";
import WalletConnectModal from "./Wallet/WalletConnectModal";
import StakingPage from "../pages/Staking/StakingPage";
import NotFound from "shared/lib/pages/NotFound";
import colors from "shared/lib/designSystem/colors";
import YourPositionModal from "./Vault/Modal/YourPositionModal";
import PausePositionModal from "./Vault/Modal/PausePositionModal";
import ResumePositionModal from "./Vault/Modal/ResumePositionModal";
import EarnPage from "../pages/DepositPage/EarnPage";
import { Web3DataContextProvider } from "shared/lib/hooks/web3DataContextProvider";
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
      <Router>
        <RoutedApp />
      </Router>
    </Root>
  );
};

const RoutedApp = () => {
  const location = useLocation();
  const isVaultPage =
    location.pathname.startsWith("/theta-vault/") ||
    location.pathname.startsWith("/v2/theta-vault/") ||
    location.pathname.startsWith("/earn/");
  const isPortfolioPage = location.pathname.startsWith("/portfolio");
  const isStakingPage = location.pathname.startsWith("/staking");
  const needsAccountData = isVaultPage || isPortfolioPage || isStakingPage;
  const needsStakingData = isStakingPage || isVaultPage;

  return (
    <Web3DataContextProvider
      fetchAssetBalances={isVaultPage || isStakingPage}
      fetchLiquidityGaugeV5={needsStakingData}
      fetchLiquidityMining={isStakingPage}
      fetchLidoOracle={isVaultPage}
      fetchSolanaVaults={isVaultPage}
      fetchTreasuryBalance={false}
      includeAccountData={needsAccountData}
    >
      <>
        <YourPositionModal />
        <PausePositionModal />
        <ResumePositionModal />
        <Header />
        <WithdrawReminderToast />
        <TxStatusToast />
        <Switch>
          <Route path="/" exact>
            <Homepage />
          </Route>
          <Route path="/theta-vault/:vaultSymbol">
            <DepositPage />
          </Route>
          <Route path="/v2/theta-vault/:vaultSymbol">
            <DepositPage />
          </Route>
          <Route path="/earn/:vaultSymbol">
            <EarnPage />
          </Route>
          <Route path="/portfolio">
            <PortfolioPage />
          </Route>
          <Route path="/staking">
            <StakingPage />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
        <Footer />
      </>
    </Web3DataContextProvider>
  );
};

export default RootApp;
