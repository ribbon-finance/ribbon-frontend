import React from "react";
import styled from "styled-components";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { Web3ReactProvider } from "@web3-react/core";
import { WalletProvider as SolanaWalletProvider } from "@solana/wallet-adapter-react";
import { SubgraphDataContextProvider } from "shared/lib/hooks/subgraphDataContext";
import { ExternalAPIDataContextProvider } from "shared/lib/hooks/externalAPIDataContext";
import { ChainContextProvider } from "shared/lib/hooks/chainContext";

import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductCarousel from "./components/ProductCarousel";
import Mission from "./components/Mission";
import Footer from "./components/Footer";
import Investors from "./components/Investors";
import PolicyPage from "./pages/PolicyPage";
import TermsPage from "./pages/TermsPage";
import colors from "shared/lib/designSystem/colors";
import StickyFooter from "./components/StickyFooter/StickyFooter";
import "shared/lib/i18n/config";

const Body = styled.div`
  background-color: ${colors.background.one};
`;

const MainContainer = styled.div`
  > * {
    margin-bottom: 80px;
  }
`;

function App() {
  return (
    <ChainContextProvider>
      <Web3ReactProvider connectors={[]}>
        <SolanaWalletProvider wallets={[]} autoConnect={false}>
          <SubgraphDataContextProvider>
            <ExternalAPIDataContextProvider>
              <Body>
                <Router>
                  <Header />

                  <Switch>
                    <Route path="/" exact>
                      <MainContainer>
                        <Hero />
                        <ProductCarousel />
                        <Mission />
                        <Investors />
                      </MainContainer>
                    </Route>

                    <Route path="/policy">
                      <PolicyPage></PolicyPage>
                    </Route>

                    <Route path="/terms">
                      <TermsPage></TermsPage>
                    </Route>

                    <Route>
                      <Redirect to="/" />
                    </Route>
                  </Switch>

                  <Footer />
                </Router>
                <StickyFooter />
              </Body>
            </ExternalAPIDataContextProvider>
          </SubgraphDataContextProvider>
        </SolanaWalletProvider>
      </Web3ReactProvider>
    </ChainContextProvider>
  );
}

export default App;
