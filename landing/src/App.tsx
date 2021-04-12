import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductCarousel from "./components/ProductCarousel";
import Mission from "./components/Mission";
import Footer from "./components/Footer";

import styled from "styled-components";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import React from "react";
import Investors from "./components/Investors";
import PolicyPage from "./pages/PolicyPage";
import TermsPage from "./pages/TermsPage";
import FAQPage from "./pages/FAQ";

const Body = styled.div`
  background-color: #1c1a19;
`;

const MainContent = styled.div``;

function App() {
  return (
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
  );
}

export default App;
