import React from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Web3ReactProvider } from "@web3-react/core";

import { Web3ContextProvider } from "shared/lib/hooks/web3Context";
import { getLibrary } from "shared/lib/utils/getLibrary";
import { Web3DataContextProvider } from "shared/lib/hooks/web3DataContext";

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

const Body = styled.div`
  background-color: ${colors.background};
`;

const MainContent = styled.div``;

function App() {
  return (
    <Web3ContextProvider>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3DataContextProvider>
          <Body>
            <Router>
              <Header />

              <Switch>
                <Route path="/" exact>
                  <Hero />
                  <MainContent>
                    <ProductCarousel />
                    <Mission />
                    <Investors />
                  </MainContent>
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
          </Body>
        </Web3DataContextProvider>
      </Web3ReactProvider>
    </Web3ContextProvider>
  );
}

export default App;
