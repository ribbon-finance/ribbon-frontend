import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductCarousel from "./components/ProductCarousel";
import Mission from "./components/Mission";
import Investors from "./components/Investors";
import Footer from "./components/Footer";
import { getLibrary } from "./utils/getLibrary";
import Row from "react-bootstrap/Row";

import { Web3ReactProvider } from "@web3-react/core";
import styled from "styled-components";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const Body = styled.div`
  background-color: #1c1a19;
`;

const MainContent = styled.div``;

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Body>
        <Router>
          <Header />
          <Hero />
          <MainContent>
            <ProductCarousel />
            <Mission />
            {/* <Investors /> */}
          </MainContent>
          <Footer />
        </Router>
      </Body>
    </Web3ReactProvider>
  );
}

export default App;
