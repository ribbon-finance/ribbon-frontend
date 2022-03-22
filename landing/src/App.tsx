import React from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Web3ReactProvider } from "@web3-react/core";
import { ConnectionProvider } from "@solana/wallet-adapter-react";

import { Web3ContextProvider } from "shared/lib/hooks/web3Context";
import { getLibrary } from "shared/lib/utils/getLibrary";
import { Web3DataContextProvider } from "shared/lib/hooks/web3DataContext";
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
import FAQPage from "./pages/FAQ";
import colors from "shared/lib/designSystem/colors";
import { getSolanaClusterURI } from "shared/lib/utils/env";
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
      <ConnectionProvider endpoint={getSolanaClusterURI()}>
        <Web3ContextProvider>
          <Web3ReactProvider getLibrary={getLibrary}>
            <Web3DataContextProvider>
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

                        <Route path="/faq">
                          <FAQPage></FAQPage>
                        </Route>
                      </Switch>

                      <Footer />
                    </Router>
                    <StickyFooter />
                  </Body>
                </ExternalAPIDataContextProvider>
              </SubgraphDataContextProvider>
            </Web3DataContextProvider>
          </Web3ReactProvider>
        </Web3ContextProvider>
      </ConnectionProvider>
    </ChainContextProvider>
  );
}

export default App;
